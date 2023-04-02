package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ProjectDetailPageDto(
    val title: MultilingualTextDto,
    val description: MultilingualTextDto
)
