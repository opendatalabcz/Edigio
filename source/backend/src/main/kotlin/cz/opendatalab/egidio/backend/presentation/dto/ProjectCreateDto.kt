package cz.opendatalab.egidio.backend.presentation.dto

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto

data class ProjectCreateDto(
    val title: MultilingualTextCreateDto,
    val description: MultilingualTextCreateDto,
    val catastropheType: CatastropheType
)
