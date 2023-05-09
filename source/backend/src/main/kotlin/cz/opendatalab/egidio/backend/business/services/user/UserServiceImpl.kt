package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.entities.user.change_request.ChangeRequestStatus
import cz.opendatalab.egidio.backend.business.entities.user.change_request.EmailChangeRequest
import cz.opendatalab.egidio.backend.business.entities.user.change_request.TelephoneNumberChangeRequest
import cz.opendatalab.egidio.backend.business.events.user.*
import cz.opendatalab.egidio.backend.business.exceptions.business.user.change_requests.NewEmailSameAsOldEmailException
import cz.opendatalab.egidio.backend.business.exceptions.business.user.change_requests.NewTelephoneNumberSameAsOldEmailException
import cz.opendatalab.egidio.backend.business.exceptions.not_found.EmailChangeRequestNotFound
import cz.opendatalab.egidio.backend.business.exceptions.not_found.TelephoneNumberChangeRequestNotFound
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.exceptions.not_unique.EmailNotUniqueException
import cz.opendatalab.egidio.backend.business.exceptions.not_unique.RegisteredUserEmailOrUsernameNotUniqueException
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.business.services.language.LanguageService
import cz.opendatalab.egidio.backend.data_access.repositories.EmailChangeRequestRepository
import cz.opendatalab.egidio.backend.data_access.repositories.TelephoneNumberChangeRequestRepository
import cz.opendatalab.egidio.backend.data_access.repositories.UserRepository
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import cz.opendatalab.egidio.backend.shared.converters.user.UserConverter
import cz.opendatalab.egidio.backend.shared.tokens.facade.ExpiringTokenFacade
import cz.opendatalab.egidio.backend.shared.uuid.UuidProvider
import jakarta.transaction.Transactional
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.OffsetDateTime
import java.util.*
import kotlin.time.Duration


@Service
@Transactional
class UserServiceImpl(
    val userRepository : UserRepository,
    val userConverter : UserConverter,
    val emailChangeRequestRepository : EmailChangeRequestRepository,
    val telephoneNumberChangeRequestRepository : TelephoneNumberChangeRequestRepository,
    val languageService : LanguageService,
    val expiringTokenFacade : ExpiringTokenFacade<String>,
    val uuidProvider : UuidProvider,
    val passwordEncoder : PasswordEncoder,
    val eventPublisher : ApplicationEventPublisher,
    val authenticationService : AuthenticationService,
    val clock : Clock

) : UserService {
    override fun getUserById(id : Long) : User {
        return userRepository.findById(id).orElseThrow { UserNotFoundException() }
    }


    override fun getRegisteredUserByUsername(username : String) : User =
        userRepository.findByUsernameAndRegisteredIsTrue(username) ?: throw UserNotFoundException()

    override fun getRegisteredUserByPublicId(publicId : UUID) : User =
        userRepository.findUserByPublicIdAndRegistered(
            publicId = publicId,
            registered = true
        ) ?: throw UserNotFoundException()

    override fun getAnyUserByPublicId(publicId : UUID) : User =
        userRepository.findUserByPublicId(publicId = publicId) ?: throw UserNotFoundException()

    override fun getPublicUserInfoByPublicId(publicId : UUID) : PublicUserInfo =
        userConverter.userToPublicUserInfo(getAnyUserByPublicId(publicId))

    override fun createNonRegisteredUser(createDto : NonRegisteredUserInfoCreateDto) : User {
        val confirmationTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        return userRepository.save(
            User(
                username = null,
                firstname = createDto.contact.firstname,
                lastname = createDto.contact.lastname,
                email = createDto.contact.email,
                phoneNumber = createDto.contact.telephoneNumber,
                password = null,
                spokenLanguages = languageService
                    .getAllByCodes(createDto.spokenLanguagesCodes)
                    .toMutableList(),
                registeredAt = OffsetDateTime.now(clock),
                emailConfirmationToken = confirmationTokenWithRawValue.token,
                registered = false,
                role = Role.NON_REGISTERED_USER,
                locked = true,
                publishedContactDetailSettings = userConverter.publishedContactDetailSettingsDtoToSettings(
                    createDto.publishedContactDetail
                ),
                emailConfirmed = false,
                publicId = uuidProvider.getNext()
            )
        ).also {
            this.eventPublisher.publishEvent(
                NonRegisteredUserCreatedEvent(
                    NonRegisteredUserCreatedEventData(
                        publicId = requireNotNull(it.publicId),
                        email = it.email,
                        rawEmailConfirmationTokenValue = confirmationTokenWithRawValue.rawValue
                    )
                )
            )
        }
    }

    override fun confirmEmail(publicId : UUID, token : String) {
        val user = getAnyUserByPublicId(publicId)
        val emailConfirmationToken = user.emailConfirmationToken
        if (emailConfirmationToken == null || !expiringTokenFacade.checks(emailConfirmationToken, token)) {
            //Let's check if token is valid first.
            // That way it will be harder to find out whether user is already activated or whether the token is just invalid
            // during reconnaissance phase of an eventual attack
            throw InsufficientAuthenticationException("Invalid confirmation token!")
        }
        check(!user.emailConfirmed, { "Email is already confirmed!" })
        //As token was used, it shouldn't be available for next confirmation
        user.emailConfirmed = true
        user.emailConfirmationToken = null
        //User shouldn't be locked before he registers, therefore we activate him now
        user.locked = false
        eventPublisher.publishEvent(
            UserContactConfirmedEvent(
                UserContactConfirmedEventData(
                    userId = requireNotNull(user.id),
                    userEmail = user.email,
                    isRegistered = user.registered
                )
            )
        )
    }

    private fun createDefaultContactDetailsSettingsForRegisteredUser() = PublishedContactDetailSettings(
        firstname = true,
        lastname = false,
        email = false,
        telephoneNumber = false
    )

    override fun registerUser(userRegistrationDto : UserRegistrationDto) : User {
        if (userRepository.existsRegisteredWithEmailOrUsername(
                userRegistrationDto.email,
                userRegistrationDto.username,
            )
        ) {
            throw RegisteredUserEmailOrUsernameNotUniqueException()
        }
        val emailConfirmationTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        val savedUser = userRepository.save(
            User(
                username = userRegistrationDto.username,
                firstname = userRegistrationDto.firstname,
                lastname = userRegistrationDto.lastname,
                email = userRegistrationDto.email,
                phoneNumber = userRegistrationDto.telephoneNumber,
                password = passwordEncoder.encode(userRegistrationDto.password),
                //Right now spoken languages are not passed during registration,
                // therefor we initialize this with an empty array
                spokenLanguages = mutableListOf(),
                //Let's respect users privacy, and go with an old saying
                // "What is not explicitly agreed upon, is implicitly disagreed"
                //Only thing that must be always accessible is username atm.
                publishedContactDetailSettings = createDefaultContactDetailsSettingsForRegisteredUser(),
                emailConfirmed = false,
                emailConfirmationToken = emailConfirmationTokenWithRawValue.token,
                registered = true,
                registeredAt = OffsetDateTime.now(clock),
                role = Role.USER,
                publicId = uuidProvider.getNext(),
                //Account is locked until user confirms email
                locked = true
            )
        )
        this.eventPublisher.publishEvent(
            UserRegisteredEvent(
                UserRegisteredEventData(
                    publicId = savedUser.publicId,
                    email = savedUser.email,
                    rawEmailConfirmationTokenValue = emailConfirmationTokenWithRawValue.rawValue
                )
            )
        )
        return savedUser
    }

    private fun invalidatePreviousUserEmailChangeRequestIfAnyActive(publicId : UUID) {
        emailChangeRequestRepository.findLatestActiveByPublicId(publicId)
            ?.apply {
                status = ChangeRequestStatus.CANCELED
                currentEmailToken = null
                newEmailToken = null
                closedAt = OffsetDateTime.now(clock)
            }
    }

    override fun createCurrentUserEmailChangeRequest(newEmail : String) {
        val currentUser = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        if (currentUser.email == newEmail) {
            throw NewEmailSameAsOldEmailException()
        } else if (userRepository.existsByEmailAndRegisteredTrue(newEmail)) {
            throw EmailNotUniqueException()
        }
        invalidatePreviousUserEmailChangeRequestIfAnyActive(currentUser.publicId)
        val currentEmailToken = expiringTokenFacade.createShortWithRawValueIncluded(Duration.parse(TOKEN_VALIDITY_DURATION))
        val newEmailToken = expiringTokenFacade.createShortWithRawValueIncluded(Duration.parse(TOKEN_VALIDITY_DURATION))
        emailChangeRequestRepository.save(
            EmailChangeRequest(
                user = currentUser,
                newEmail = newEmail,
                currentEmailToken = currentEmailToken.token,
                newEmailToken = newEmailToken.token,
                createdAt = OffsetDateTime.now(clock),
                status = ChangeRequestStatus.ACTIVE,
                closedAt = null
            )
        )
        this.eventPublisher.publishEvent(
            EmailChangeRequestCreatedEvent(
                EmailChangeRequestCreatedEventData(
                    newEmail = newEmail,
                    currentEmail = currentUser.email,
                    rawCurrentEmailConfirmationToken = currentEmailToken.rawValue,
                    rawNewEmailConfirmationToken = newEmailToken.rawValue,
                    username = requireNotNull(currentUser.username)
                )
            )
        )
    }

    private fun confirmEmailChangeRequest(user : User, changeRequest : EmailChangeRequest) {
        user.email = changeRequest.newEmail
        changeRequest.apply {
            currentEmailToken = null
            newEmailToken = null
            status = ChangeRequestStatus.CONFIRMED
            closedAt = OffsetDateTime.now(clock)
        }
    }

    override fun confirmCurrentUserEmailChangeRequest(currentEmailToken : String, newEmailToken : String) {
        val currentUser = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        val request = emailChangeRequestRepository.findLatestActiveByPublicId(currentUser.publicId)
            ?: throw EmailChangeRequestNotFound()
        if (currentUser.email == request.newEmail) {
            throw NewEmailSameAsOldEmailException()
        } else if (userRepository.existsByEmailAndRegisteredTrue(request.newEmail)) {
            throw EmailNotUniqueException()
        }
        if (
            !expiringTokenFacade.nullableTokenAndValueChecks(request.currentEmailToken, currentEmailToken)
            || !expiringTokenFacade.nullableTokenAndValueChecks(request.newEmailToken, newEmailToken)
        ) {
            throw AccessDeniedException("Invalid tokens value")
        }
        val oldEmail = currentUser.email
        confirmEmailChangeRequest(
            user = currentUser,
            changeRequest = request
        )
        eventPublisher.publishEvent(
            EmailChangeRequestConfirmedEvent(
                EmailChangeRequestConfirmedEventData(
                    oldEmail = oldEmail,
                    newEmail = currentUser.email
                )
            )
        )
    }

    private fun invalidatePreviousUserTelephoneNumberChangeRequestIfAnyActive(publicId : UUID) {
        telephoneNumberChangeRequestRepository.findLatestActiveByPublicId(publicId)
            ?.apply {
                status = ChangeRequestStatus.CANCELED
                closedAt = OffsetDateTime.now()
                confirmationToken = null
            }
    }

    override fun createCurrentUserTelephoneNumberChangeRequest(newNumber : String) {
        val currentUser = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        if (currentUser.phoneNumber == newNumber) {
            throw NewTelephoneNumberSameAsOldEmailException()
        }
        invalidatePreviousUserTelephoneNumberChangeRequestIfAnyActive(currentUser.publicId)
        val token = expiringTokenFacade.createShortWithRawValueIncluded(Duration.parse(TOKEN_VALIDITY_DURATION))
        telephoneNumberChangeRequestRepository.save(
            TelephoneNumberChangeRequest(
                user = currentUser,
                newTelephoneNumber = newNumber,
                confirmationToken = token.token,
                createdAt = OffsetDateTime.now(clock),
                status = ChangeRequestStatus.ACTIVE,
                closedAt = null
            )
        )
        this.eventPublisher.publishEvent(
            TelephoneNumberChangeRequestCreatedEvent(
                TelephoneNumberChangeRequestCreatedEventData(
                    email = currentUser.email,
                    rawConfirmationToken = token.rawValue
                )
            )
        )
    }

    override fun confirmCurrentUserTelephoneNumberChangeRequest(confirmationToken : String) {
        val currentUser = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        val request = telephoneNumberChangeRequestRepository.findLatestActiveByPublicId(currentUser.publicId)
            ?: throw TelephoneNumberChangeRequestNotFound()
        if (!expiringTokenFacade.nullableTokenAndValueChecks(request.confirmationToken, confirmationToken)) {
            throw AccessDeniedException("Confirmation token wrong!")
        }
        if (currentUser.phoneNumber == request.newTelephoneNumber) {
            throw NewTelephoneNumberSameAsOldEmailException()
        }
        currentUser.phoneNumber = request.newTelephoneNumber
        request.closedAt = OffsetDateTime.now(clock)
        request.confirmationToken = null
        request.status = ChangeRequestStatus.CONFIRMED
        this.eventPublisher.publishEvent(TelephoneNumberChangeRequestConfirmedEvent(
            data = TelephoneNumberChangeRequestConfirmedEventData(email = currentUser.email)
        ))
    }

    override fun changeCurrentUserPublishedContactDetailSettings(
        updateDto : PublishedContactDetailSettingsUpdateDto
    ) {
        val user = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        user.publishedContactDetailSettings = this.userConverter.publishedContactDetailSettingsUpdateDtoToSettings(
            originalSettings = user.publishedContactDetailSettings,
            updateDto = updateDto
        )
        this.eventPublisher.publishEvent(
            PublishedContactDetailSettingsChangedEvent(
                PublishedContactDetailSettingsChangedEventData.of(user)
            )
        )
    }

    override fun changeCurrentUserSpokenLanguages(
        languagesCodes : List<String>
    ) {
        val user = authenticationService.currentLoggedInUser ?: throw AccessDeniedException(USER_NOT_LOGGED_MSG)
        user.spokenLanguages = this.languageService.getAllByCodes(languagesCodes).toMutableList()
        this.eventPublisher.publishEvent(
            SpokenLanguagesChangedEvent(
                SpokenLanguagesChangedEventData.of(user)
            )
        )
    }

    companion object {
        private const val USER_NOT_LOGGED_MSG = "User not logged!"
        private const val TOKEN_VALIDITY_DURATION = "24h"
    }
}