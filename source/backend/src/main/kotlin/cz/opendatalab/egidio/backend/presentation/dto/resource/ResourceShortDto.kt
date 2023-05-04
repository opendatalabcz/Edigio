package cz.opendatalab.egidio.backend.presentation.dto.resource

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(name = "Short variant of resource available for listing in advertisement or response")
data class ResourceShortDto(
    @field:NotNull
    @field:Schema(
        description = "Name of resource",
        requiredMode = RequiredMode.REQUIRED
    )
    val name : MultilingualTextDto,

    @field:NotNull
    @field:NotBlank
    @field:Schema(
        description = "Slug which identifies the  resource",
        requiredMode = RequiredMode.REQUIRED
    )
    val slug : String
)
