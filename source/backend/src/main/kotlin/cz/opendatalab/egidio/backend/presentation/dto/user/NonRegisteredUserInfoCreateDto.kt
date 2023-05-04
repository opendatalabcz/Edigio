package cz.opendatalab.egidio.backend.presentation.dto.user

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "DTO for creation of non-registered user during advertisement creation, and response creation")
data class NonRegisteredUserInfoCreateDto(
    @Schema(
        description = "User contact",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val contact: ContactCreateDto,
    @Schema(
        description = "Level of published details",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val publishedContactDetail: PublishedContactDetailSettingsDto,
    @Schema(
        description = "Level of published details",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        defaultValue = "Empty list"
    )
    val spokenLanguagesCodes: List<String> = listOf()
)
