package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PASSWORD_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PASSWORD_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PHONE_NUMBER
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_REGEX
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class UserRegistrationDto(
    @field:NotNull(message = "is required!")
    @field:Size(
        min = USERNAME_MIN_LENGTH,
        message = "is too short (min length is $USERNAME_MIN_LENGTH)"
    )
    @field:Size(
        max = USERNAME_MAX_LENGTH,
        message = "is too long (max length is $USERNAME_MAX_LENGTH)"
    )
    @field:Pattern(
        regexp = USERNAME_REGEX,
        message = "contains chars that are not valid for username"
    )
    val username: String,
    @field:NotNull(message = "is required!")
    @field:NotBlank(message = "must not be blank!")
    val firstname: String,
    @field:NotNull
    @field:NotBlank(message = "must not be blank!")
    val lastname: String,
    @field:NotNull(message = "is required!")
    @field:Email(message = "must be valid email!")
    val email: String,
    @field:Nullable
    @field:Pattern(
        regexp = PHONE_NUMBER,
        message = "must be valid phone number"
    )
    val telephoneNumber: String?,
    @field:NotNull(message = "is required!")
    @field:Size(
        min = PASSWORD_MIN_LENGTH,
        message = "Password is too short (min length is $PASSWORD_MIN_LENGTH)"
    )
    @field:Size(
        max = PASSWORD_MAX_LENGTH,
        message = "Password is too long (max length is $PASSWORD_MAX_LENGTH)"
    )
    //Pattern that allows alphanumeric chars and special chars as described here
    // https://owasp.org/www-community/password-special-characters
    @field:Pattern(
        regexp = UserValidationConstants.PASSWORD_REGEX,
        message = "must contain only valid password characters!"
    )
    val password: String,
)
