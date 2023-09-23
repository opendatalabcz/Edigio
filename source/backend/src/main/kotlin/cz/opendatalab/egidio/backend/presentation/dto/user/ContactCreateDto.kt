package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants.EMAIL_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants.FIRSTNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants.LASTNAME_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants.PHONE_NUMBER_REGEX
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants.TELEPHONE_NUMBER_MAX_LENGTH
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
    val firstname : String,
    @Schema(
        description = "User lastname",
        requiredMode = Schema.RequiredMode.REQUIRED,
        maxLength = LASTNAME_MAX_LENGTH,
    )
    @field:Size(
        max = LASTNAME_MAX_LENGTH,
        message = "cannot be longer than $LASTNAME_MAX_LENGTH"
    )
    val lastname : String,
    @Schema(
        description = "User email",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    @field:Email
    @field:Size(max = EMAIL_MAX_LENGTH)
    val email : String,
    @Schema(
        description = "User telephone number.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        pattern = PHONE_NUMBER_REGEX,
    )
    @field:Pattern(
        regexp = PHONE_NUMBER_REGEX,
        message = "must be valid phone number!"
    )
    @field:Size(max = TELEPHONE_NUMBER_MAX_LENGTH)
    val telephoneNumber : String?
)