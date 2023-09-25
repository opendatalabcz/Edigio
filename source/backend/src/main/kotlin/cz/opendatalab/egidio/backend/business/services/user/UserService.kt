package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants
import jakarta.annotation.security.PermitAll
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.validation.annotation.Validated
import java.util.*


@Validated
interface UserService {
    /**
     * Get user by ID (either registered or non-registered)
     *
     * @throws UserNotFoundException when no registered user with given username is found
     */
    @PermitAll
    fun getUserById(id: Long): User

    /**
     * Get registered user by his username
     *
     * @throws UserNotFoundException when no registered user with given username is found
     */
    @PermitAll
    fun getRegisteredUserByUsername(username: String) : User

    /**
     * Create non-registered user
     */
    @PermitAll
    fun createNonRegisteredUser(@Valid createDto: NonRegisteredUserInfoCreateDto) : User

    /**
     * Confirm users email and activate his account
     */
    @PermitAll
    fun confirmEmail(publicId : UUID, token : String)

    /**
     * Get registered user by his public ID
     */
    @PermitAll
    fun getRegisteredUserByPublicId(publicId: UUID): User

    /**
     * Make registered user
     */
    @PermitAll
    fun registerUser(@Valid userRegistrationDto: UserRegistrationDto): User

    /**
     * Get either registered or non-registered user by public id
     */
    @PermitAll
    fun getAnyUserByPublicId(publicId: UUID): User

    /**
     * Get public user info by his public id
     */
    @PermitAll
    fun getPublicUserInfoByPublicId(publicId : UUID) : PublicUserInfo

    /**
     * Change published contact details settings of currently logged user
     */
    @PermitAll
    fun changeCurrentUserPublishedContactDetailSettings(
        @Valid
        updateDto : PublishedContactDetailSettingsUpdateDto
    )

    /**
     * Change spoken languages  of currently logged user
     */
    @PermitAll
    fun changeCurrentUserSpokenLanguages(languagesCodes : List<String>)

    /**
     * Request email change for currently logged user
     */
    @PermitAll
    fun createCurrentUserEmailChangeRequest(
        @Email
        @Size(max = UserValidationConstants.EMAIL_MAX_LENGTH)
        newEmail : String
    )

    /**
     * Confirm email change request for currently logged in user
     */
    @PermitAll
    fun confirmCurrentUserEmailChangeRequest(currentEmailToken : String, newEmailToken : String)

    /**
     * Request telephone number change for currently logged user
     */
    @PermitAll
    fun createCurrentUserTelephoneNumberChangeRequest(
        @Size(max = UserValidationConstants.TELEPHONE_NUMBER_MAX_LENGTH)
        @Pattern(regexp = UserValidationConstants.PHONE_NUMBER_REGEX)
        newNumber : String
    )

    /**
     * Confirm telephone number change request for currently logged in user
     */
    @PermitAll
    fun confirmCurrentUserTelephoneNumberChangeRequest(confirmationToken : String)
}