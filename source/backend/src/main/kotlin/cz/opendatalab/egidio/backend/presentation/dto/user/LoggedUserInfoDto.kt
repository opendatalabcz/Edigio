package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.util.*

/**
 * The most summarized info about currently logged-in user
 *
 * Designed to be as light as possible, so it can be retrieved frequently (frontend asks for it with each request)
 */
@Schema(
    description = "The most summarized info about currently logged-in user"
)
data class LoggedUserInfoDto(
    @field:NotNull
    @Schema(
        description = "Identifier of the user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val publicId : UUID,

    @field:NotNull
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
    @Schema(
        description = "Username of the user",
        requiredMode = Schema.RequiredMode.REQUIRED,
        minLength = UserValidationConstants.USERNAME_MIN_LENGTH,
        maxLength = UserValidationConstants.USERNAME_MAX_LENGTH,
        pattern = UserValidationConstants.USERNAME_REGEX,
    )
    val username : String,

    @field:NotNull
    @Schema(
        description = "User role",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val role : Role
)