package cz.opendatalab.egidio.backend.presentation.dto.advertisement_template

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Preview variant of AdvertisementTemplate"
)
data class AdvertisementTemplatePreviewDto(
    @field:Schema(
        description = "Short, descriptive, name of template",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val name: MultilingualTextDto,
    @field:Schema(
        description = "Longer description of template",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val description: MultilingualTextDto?,
    @field:Schema(
        description = "Slug that can be used to identify the template",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val slug: String,
)
