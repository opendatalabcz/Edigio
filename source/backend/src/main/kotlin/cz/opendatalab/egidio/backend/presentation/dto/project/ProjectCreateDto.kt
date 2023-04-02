package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ProjectCreateDto(
    val title: MultilingualTextDto,
    val description: MultilingualTextDto,
    val catastropheType: CatastropheType
)
