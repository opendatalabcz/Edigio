package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import java.time.LocalDateTime

data class ProjectFilter(
    val title: MultilingualTextFilter?,
    val catastropheTypes: List<CatastropheType>?,
    val projectStatuses: List<ProjectStatus>?,
    val publishedAfter: LocalDateTime?,
    val publishedBefore: LocalDateTime?
) {
    companion object {
        fun of(title: MultilingualTextFilter? = null,
               catastropheTypes: List<CatastropheType>? = null,
               projectStatuses: List<ProjectStatus>? = null,
               publishedAfter: LocalDateTime? = null,
               publishedBefore: LocalDateTime? = null
        ) = ProjectFilter(
            title = title,
            catastropheTypes = catastropheTypes,
            projectStatuses = projectStatuses,
            publishedAfter = publishedAfter,
            publishedBefore = publishedBefore
        )
    }
}