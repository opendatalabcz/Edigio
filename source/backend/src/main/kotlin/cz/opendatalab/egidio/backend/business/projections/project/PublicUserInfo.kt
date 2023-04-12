package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

class PublicUserInfo(
    @field:Nullable
    @field:Size(
        min = UserValidationConstants.USERNAME_MIN_LENGTH,
        message = "is too short (min length is ${UserValidationConstants.USERNAME_MIN_LENGTH})"
    )
    @field:Size(
        max = UserValidationConstants.USERNAME_MAX_LENGTH,
        message = "is too long (max length is ${UserValidationConstants.USERNAME_MAX_LENGTH})"
    )
    @field:Pattern(
        regexp = UserValidationConstants.USERNAME_REGEX,
        message = "contains chars that are not valid for username"
    )
    val username : String?,

    @field:Nullable
    @field:Pattern(
        regexp = UserValidationConstants.NAME_PART,
        message = "must be valid firstname"
    )
    val firstname : String?,

    @field:Nullable
    @field:Pattern(
        regexp = UserValidationConstants.NAME_PART,
        message = "must be valid lastname"
    )
    val lastname : String?,

    @field:Nullable
    @field:Email
    val email : String?,

    @field:Nullable
    @field:Pattern(
        regexp = UserValidationConstants.PHONE_NUMBER,
        message = "must be valid phone number"
    )
    val telephoneNumber : String?,

    @field:Nullable
    val spokenLanguages : List<Language>
)