package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.NullOrNotBlank
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.PHONE_NUMBER
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_MIN_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.USERNAME_REGEX
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@Schema(
    description = "DTO containing only information that can be accessed by public. Some fields might be null depending on settings."
)
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
    @Schema(
        description = "Username of the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        minLength = USERNAME_MIN_LENGTH,
        maxLength = USERNAME_MAX_LENGTH,
        pattern = USERNAME_REGEX
    )
    val username : String?,

    @field:Nullable
    @field:NullOrNotBlank
    @Schema(
        description = "Firstname of the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val firstname : String?,

    @field:Nullable
    @field:NullOrNotBlank
    @Schema(
        description = "Firstname of the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val lastname : String?,

    @field:Nullable
    @field:Email
    @Schema(
        description = "Email address of the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val email : String?,

    @field:Nullable
    @field:Pattern(
        regexp = PHONE_NUMBER,
        message = "must be valid phone number"
    )
    @Schema(
        description = "Telephone number of the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val telephoneNumber : String?,

    @field:Nullable
    @Schema(
        description = "Codes of languages known by the user",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val spokenLanguagesCodes : List<String>?,
)
