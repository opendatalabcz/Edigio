package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.FIRSTNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.LASTNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PASSWORD_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PASSWORD_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PASSWORD_REGEX
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PHONE_NUMBER
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_REGEX
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.constraints.*

@Schema(
    description = "DTO tailored for user registration"
)
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
    @Schema(
        description = "Username of user",
        minLength = USERNAME_MIN_LENGTH,
        maxLength = USERNAME_MAX_LENGTH,
        pattern = USERNAME_REGEX
    )
    val username : String,
    @field:NotNull(message = "is required!")
    @field:NotBlank(message = "must not be blank!")
    @field:Size(
        max = FIRSTNAME_MAX_LENGTH,
        message = "cannot be longer than $FIRSTNAME_MAX_LENGTH"
    )
    @field:Schema(
        title = "abc",
        description = "Firstname of user",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val firstname : String,
    @field:NotNull
    @field:NotBlank(message = "must not be blank!")
    @field:Size(
        max = LASTNAME_MAX_LENGTH,
        message = "cannot be longer than $LASTNAME_MAX_LENGTH"
    )
    @Schema(
        description = "Lastname of user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val lastname : String,
    @field:NotNull(message = "is required!")
    @field:Email(message = "must be valid email!")
    @Schema(
        description = "Email address of user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val email : String,
    @field:Nullable
    @field:Pattern(
        regexp = PHONE_NUMBER,
        message = "must be valid phone number"
    )
    @Schema(
        description = "Telephone number of user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        pattern = PHONE_NUMBER
    )
    val telephoneNumber : String?,
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
        regexp = PASSWORD_REGEX,
        message = "must contain only valid password characters!"
    )
    @Schema(
        description = "User password",
        minLength = PASSWORD_MIN_LENGTH,
        maxLength = PASSWORD_MAX_LENGTH,
        pattern = PASSWORD_REGEX
    )
    val password : String,
)
