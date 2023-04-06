package cz.opendatalab.egidio.backend.presentation.dto.resource

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull

@Schema(description = "Structure for creation of resource listable in advertisement/response")
data class ResourceCreateDto(
    @field:NotNull
    @field:MultilingualTextValid
    @field:Schema(
        description = "Name of resource",
        required = true
    )
    val name: MultilingualTextDto,

    @field:NotNull
    @field:MultilingualTextValid
    @field:Schema(
        description = "Description of resource. Should be as general as possible.",
        required = true
    )
    val description: MultilingualTextDto,
)
