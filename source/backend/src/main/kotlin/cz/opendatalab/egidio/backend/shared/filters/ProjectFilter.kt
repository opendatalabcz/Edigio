package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import java.time.LocalDateTime

data class ProjectFilter(
    val title: MultilingualTextFilter?,
    val catastropheTypes: List<CatastropheType>?,
    val publishedAfter: LocalDateTime?,
    val publishedBefore: LocalDateTime?
) {
    companion object {
        fun of(title: MultilingualTextFilter? = null,
               catastropheTypes: List<CatastropheType>? = null,
               publishedAfter: LocalDateTime? = null,
               publishedBefore: LocalDateTime? = null
        ) = ProjectFilter(
            title = title,
            catastropheTypes = catastropheTypes,
            publishedAfter = publishedAfter,
            publishedBefore = publishedBefore
        )
    }
}