package cz.opendatalab.egidio.backend.presentation.dto.resource

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull

@Schema(description = "Structure for creation of resource listable in advertisement/response")
data class ResourceCreateDto(
    @field:NotNull
    @field:Schema(
        description = "Name of resource",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val name : MultilingualTextDto,

    @field:NotNull
    @field:Schema(
        description = "Description of resource. Should be as general as possible.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val description : MultilingualTextDto,
)
