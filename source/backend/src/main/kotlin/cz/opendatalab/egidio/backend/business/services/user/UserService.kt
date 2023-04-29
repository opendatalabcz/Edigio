package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
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
    fun getUserById(id: Long): User
    /**
     * Get registered user by his username
     *
     * @throws UserNotFoundException when no registered user with given username is found
     */
    fun getRegisteredUserByUsername(@Valid username: String) : User

    /**
     * Create non-registered user
     */
    fun createNonRegisteredUser(createDto: NonRegisteredUserInfoCreateDto) : User

    /**
     * Confirm users email and activate his account
     */
    fun confirmEmail(publicId : UUID, token : String)

    /**
     * Get registered user by his public ID
     */
    fun getRegisteredUserByPublicId(publicId: UUID): User

    /**
     * Make registered user
     */
    fun registerUser(userRegistrationDto: UserRegistrationDto): User
    fun getAnyUserByPublicId(publicId: UUID): User
    fun getPublicUserInfoByPublicId(publicId : UUID) : PublicUserInfo
    fun changeCurrentUserPublishedContactDetailSettings(
        updateDto : PublishedContactDetailSettingsUpdateDto
    )

    fun changeCurrentUserSpokenLanguages(languagesCodes : List<String>)
    fun createCurrentUserEmailChangeRequest(newEmail : String)
    fun confirmCurrentUserEmailChangeRequest(currentEmailToken : String, newEmailToken : String)
    fun createCurrentUserTelephoneNumberChangeRequest(newNumber : String)
    fun confirmCurrentUserTelephoneNumberChangeRequest(confirmationToken : String)
}