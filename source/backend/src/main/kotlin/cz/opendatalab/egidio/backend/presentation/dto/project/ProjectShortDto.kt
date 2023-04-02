package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ProjectShortDto(
    val title: MultilingualTextDto,
    val description: MultilingualTextDto,
)
