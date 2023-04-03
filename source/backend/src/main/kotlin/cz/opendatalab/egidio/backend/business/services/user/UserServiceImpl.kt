package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.exceptions.not_unique.RegisteredUserEmailOrUsernameNotUniqueException
import cz.opendatalab.egidio.backend.business.services.language.LanguageService
import cz.opendatalab.egidio.backend.persistence.repositories.UserRepository
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import cz.opendatalab.egidio.backend.shared.tokens.factory.ExpiringTokenFactory
import cz.opendatalab.egidio.backend.shared.tokens.checker.ExpiringTokenChecker
import cz.opendatalab.egidio.backend.shared.uuid.UuidProvider
import jakarta.transaction.Transactional
import org.springframework.security.authentication.InsufficientAuthenticationException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime
import java.util.*


@Service
@Transactional
class UserServiceImpl(
    val userRepository: UserRepository,
    val languageService: LanguageService,
    val clock: Clock,
    val expiringTokenFactory: ExpiringTokenFactory<UUID>,
    val uuidTokenChecker: ExpiringTokenChecker<UUID>,
    val uuidProvider: UuidProvider,
    val passwordEncoder: PasswordEncoder
) : UserService {
    override fun getUserById(id: Long): User {
        return userRepository.findById(id).orElseThrow { UserNotFoundException() }
    }


    override fun getRegisteredUserByUsername(username: String): User =
        userRepository.findByUsernameAndRegisteredIsTrue(username) ?: throw UserNotFoundException()

    override fun getRegisteredUserByPublicId(publicId: UUID): User =
        userRepository.findUserByPublicIdAndRegisteredIsTrue(publicId) ?: throw UserNotFoundException()

    private fun createPublishedContactDetailSettings(
        settingsDto: PublishedContactDetailSettingsDto
    ): PublishedContactDetailSettings = PublishedContactDetailSettings(
        firstname = settingsDto.firstname,
        lastname = settingsDto.lastname,
        email = settingsDto.email,
        telephoneNumber = settingsDto.telephoneNumber
    )

    override fun createAnonymousUser(createDto: AnonymousUserInfoCreateDto): User {
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
                registeredAt = LocalDateTime.now(clock),
                emailConfirmationToken = expiringTokenFactory.create(validityDuration = null) { println("Email confirmation token: ${it}") },
                registered = false,
                role = Role.ANONYMOUS_USER,
                locked = true,
                publishedContactDetailSettings = createPublishedContactDetailSettings(createDto.publishedContactDetail),
                emailConfirmed = false,
                publicId = uuidProvider.getNext()
            )
        )
    }

    override fun confirmEmail(publicId: UUID, token: UUID) {
        val user = getRegisteredUserByPublicId(publicId)
        val emailConfirmationToken = user.emailConfirmationToken
        if (emailConfirmationToken == null || !uuidTokenChecker.checks(emailConfirmationToken, token)) {
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
    }

    override fun registerUser(userRegistrationDto: UserRegistrationDto) : User{
        if(userRepository.existsUserByEmailOrUsername(userRegistrationDto.email, userRegistrationDto.username)) {
            throw RegisteredUserEmailOrUsernameNotUniqueException()
        }
        val user = User(
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
            publishedContactDetailSettings = PublishedContactDetailSettings(
                firstname = true,
                lastname = false,
                email = false,
                telephoneNumber = false
            ),
            emailConfirmed = false,
            emailConfirmationToken = expiringTokenFactory.create(validityDuration = null) { println("Email confirmation token: ${it}") },
            registered = true,
            registeredAt = LocalDateTime.now(),
            role = Role.USER,
            publicId = uuidProvider.getNext(),
            //Account is locked until user confirms email
            locked = true
        )
        return userRepository.save(user)
    }
}