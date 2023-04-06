package cz.opendatalab.egidio.backend.presentation.dto.resource

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(name = "Short variant of resource available for listing in advertisement or response")
data class ResourceShortDto(
    @field:NotNull
    @field:MultilingualTextValid
    @field:Schema(
        description = "Name of resource"
    )
    val name: MultilingualTextDto,

    @field:NotNull
    @field:NotBlank
    @field:Schema(
        description = "Slug which identifies the  resource"
    )
    val slug: String
)
