package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import java.util.*

/**
 * The most summarized info about currently logged-in user
 *
 * Designed to be as light as possible, so it can be retrieved frequently (frontend asks for it with each request)
 */
data class LoggedUserInfo(
    @field:NotNull
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
    val username : String,

    @field:NotNull
    val role : Role
)