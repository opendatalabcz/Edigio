package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.presentation.dto.user.*
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import java.util.*

@Validated
interface UserController {
    fun register(@Valid registrationDto : UserRegistrationDto) : ResponseEntity<UUID>
    fun confirmEmail(publicId : UUID, token : String)
    fun getPublicUserInfo(publicId : UUID) : ResponseEntity<PublicUserInfoDto>
    fun getLoggedUserInfo() : ResponseEntity<LoggedUserInfoDto?>
    fun changeCurrentUserPublishedContactDetailSettings(
        updateDto : PublishedContactDetailSettingsUpdateDto
    )

    fun changeCurrentUserSpokenLanguages(languagesCodes : List<String>)
    fun getCurrentUser() : UserDto?
    fun requestCurrentUserEmailChange(
        @Size(max = UserValidationConstants.EMAIL_MAX_LENGTH)
        @Email
        newEmail : String
    )
    fun confirmCurrentUserEmailChange(currentEmailToken : String, newEmailToken : String)
    fun requestCurrentUserTelephoneNumberChange(
        @Size(max = UserValidationConstants.TELEPHONE_NUMBER_MAX_LENGTH)
        @Pattern(regexp = UserValidationConstants.PHONE_NUMBER_REGEX)
        newNumber : String
    )
    fun confirmCurrentUserTelephoneNumberChange(confirmationToken : String)
}