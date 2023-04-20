package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ProjectShortDto(
    val slug : String?,
    val title : MultilingualTextDto,
    val description : MultilingualTextDto,
    val status: ProjectStatus
)
