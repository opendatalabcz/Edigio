package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.NullOrNotBlank
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PHONE_NUMBER
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_REGEX
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class PublicUserInfoDto(
    @field:Nullable
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
    val username : String?,

    @field:Nullable
    @field:NullOrNotBlank
    val firstname : String?,

    @field:Nullable
    @field:NullOrNotBlank
    val lastname : String?,

    @field:Nullable
    @field:Email
    val email : String?,

    @field:Nullable
    @field:Pattern(
        regexp = PHONE_NUMBER,
        message = "must be valid phone number"
    )
    val telephoneNumber : String?,

    @field:Nullable
    val spokenLanguagesCodes : List<String>?,
)
