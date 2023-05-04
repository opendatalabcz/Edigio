package cz.opendatalab.egidio.backend.presentation.dto.user

import io.swagger.v3.oas.annotations.media.Schema
import java.util.UUID


@Schema(
    description = "Single user, either registered or non-registered"
)
data class UserDto(
    @field:Schema(
        description = "Identifier of the user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val publicId: UUID,
    @field:Schema(
        description = "Username of the user. Not included when user is not registered.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val username : String?,
    @field:Schema(
        description = "Firstname of the user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val firstname : String,
    @field:Schema(
        description = "Lastname of the user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val lastname : String,
    @field:Schema(
        description = "Email of the user",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val email : String,
    @field:Schema(
        description = "Telephone number of the user. User might opted not to fill it, then this field would be null",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val telephoneNumber : String?,
    @field:Schema(
        description = "Languages known by user. User might opted not to fill it, then this would be an empty array.",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val spokenLanguagesCodes : List<String>,
    @field:Schema(
        description = "Languages known by user. User might opted not to fill it, then this would be an empty array.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val publishedContactDetailsSettings : PublishedContactDetailSettingsDto
)
