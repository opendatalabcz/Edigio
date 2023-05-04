package cz.opendatalab.egidio.backend.presentation.dto.resource

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(name = "Resource available for listing in advertisement or response")
data class ResourceDto(
    @field:NotNull
    @field:Schema(
        description = "Name of resource",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val name : MultilingualTextDto,
    @field:NotNull
    @field:Schema(
        description = "Description of resource. Should be as general as possible.",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val description : MultilingualTextDto,
    @field:NotNull
    @field:NotBlank
    @field:Schema(
        description = "Slug which identifies the  resource",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val slug : String
)
