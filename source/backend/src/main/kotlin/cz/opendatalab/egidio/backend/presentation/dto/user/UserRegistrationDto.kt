package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.NAME_PART
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PASSWORD_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PASSWORD_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.PHONE_NUMBER
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.user.UserValidationConstants.USERNAME_REGEX
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class UserRegistrationDto(
    @field:NotNull
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
    @field:NotNull
    @field:Pattern(
        regexp = NAME_PART,
        message = "must be valid firstname"
    )
    val firstname: String,
    @field:NotNull
    @field:Pattern(
        regexp = NAME_PART,
        message = "must be valid lastname"
    )
    val lastname: String,
    @field:NotNull
    @field:Email
    val email: String,
    @field:Nullable
    @field:Pattern(
        regexp = PHONE_NUMBER,
        message = "must be valid phone number"
    )
    val telephoneNumber: String?,
    @field:NotNull
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