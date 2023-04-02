package cz.opendatalab.egidio.backend.shared.converters.project

import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectDetailPageDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectShortDto

interface ProjectConverter {
    fun projectToShortDto(project: Project) : ProjectShortDto
    fun projectToDetailPageDto(project: Project): ProjectDetailPageDto
}