package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus

data class CatastropheTypeAndProjectStatus(
    val catastropheType: CatastropheType,
    val projectStatus: ProjectStatus
)
