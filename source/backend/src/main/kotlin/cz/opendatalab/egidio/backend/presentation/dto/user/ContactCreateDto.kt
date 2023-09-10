package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.FIRSTNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants.LASTNAME_MAX_LENGTH
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@Schema(
    description = "DTO for creation of contact part of a user"
)
data class ContactCreateDto(
    @Schema(
        description = "User firstname",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = FIRSTNAME_MAX_LENGTH
    )
    @field:Size(
        max = FIRSTNAME_MAX_LENGTH,
        message = "cannot be longer than $FIRSTNAME_MAX_LENGTH"
    )
    val firstname: String,
    @Schema(
        description = "User lastname",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = LASTNAME_MAX_LENGTH,
    )
    @field:Size(
        max = LASTNAME_MAX_LENGTH,
        message = "cannot be longer than $LASTNAME_MAX_LENGTH"
    )
    val lastname: String,
    @Schema(
        description = "User email",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    @field:Email
    val email: String,
    @Schema(
        description = "User telephone number.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        pattern = UserValidationConstants.PHONE_NUMBER,
    )
    @field:Pattern(
        regexp = UserValidationConstants.PHONE_NUMBER,
        message = "must be valid phone number!"
    )
    val telephoneNumber: String?
)