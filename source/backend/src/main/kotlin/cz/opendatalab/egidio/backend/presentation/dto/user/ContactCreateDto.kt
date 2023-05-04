package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.UserValidationConstants
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern

@Schema(
    description = "DTO for creation of contact part of a user"
)
data class ContactCreateDto(
    @field:Schema(
        description = "User firstname",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val firstname: String,
    @field:Schema(
        description = "User lastname",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val lastname: String,
    @field:Email
    @field:Schema(
        description = "User email",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val email: String,
    @field:Pattern(
        regexp = UserValidationConstants.PHONE_NUMBER,
        message = "must be valid phone number!"
    )
    @field:Schema(
        description = "User telephone number.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        pattern = UserValidationConstants.PHONE_NUMBER,
    )
    val telephoneNumber: String?
)