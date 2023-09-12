package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import jakarta.annotation.security.PermitAll
import jakarta.validation.Valid
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
    fun getRegisteredUserByUsername(@Valid username: String) : User

    /**
     * Create non-registered user
     */
    @PermitAll
    fun createNonRegisteredUser(createDto: NonRegisteredUserInfoCreateDto) : User

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
    fun registerUser(userRegistrationDto: UserRegistrationDto): User

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
    fun createCurrentUserEmailChangeRequest(newEmail : String)

    /**
     * Confirm email change request for currently logged in user
     */
    @PermitAll
    fun confirmCurrentUserEmailChangeRequest(currentEmailToken : String, newEmailToken : String)

    /**
     * Request telephone number change for currently logged user
     */
    @PermitAll
    fun createCurrentUserTelephoneNumberChangeRequest(newNumber : String)

    /**
     * Confirm telephone number change request for currently logged in user
     */
    @PermitAll
    fun confirmCurrentUserTelephoneNumberChangeRequest(confirmationToken : String)
}