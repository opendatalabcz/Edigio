package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import java.time.OffsetDateTime

data class ProjectFilter(
    val title: MultilingualTextFilter?,
    val catastropheTypes: List<CatastropheType>?,
    val projectStatuses: List<ProjectStatus>?,
    val publishedAfter: OffsetDateTime?,
    val publishedBefore: OffsetDateTime?
) {
    companion object {
        fun of(title: MultilingualTextFilter? = null,
               catastropheTypes: List<CatastropheType>? = null,
               projectStatuses: List<ProjectStatus>? = null,
               publishedAfter: OffsetDateTime? = null,
               publishedBefore: OffsetDateTime? = null
        ) = ProjectFilter(
            title = title,
            catastropheTypes = catastropheTypes,
            projectStatuses = projectStatuses,
            publishedAfter = publishedAfter,
            publishedBefore = publishedBefore
        )
    }
}