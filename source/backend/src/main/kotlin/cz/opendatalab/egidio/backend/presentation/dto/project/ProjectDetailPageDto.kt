package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Content of project detail page. Tailored specially for frontend."
)
data class ProjectDetailPageDto(
    @field:Schema(
        description = "Multilingual project title",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val title: MultilingualTextDto,
    @field:Schema(
        description = "Multilingual project description",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val description: MultilingualTextDto
)
