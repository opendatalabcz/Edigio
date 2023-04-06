package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ResourceRepository : JpaRepository<Resource, Long> {
    fun getBySlug(@Param("slug") slug: String): Resource

    @Query(
        """
        SELECT DISTINCT resource
        FROM Resource resource
        JOIN resource.name.texts titles_translations ON (
            :#{#filter == null} = true
            OR titles_translations.language = resource.name.defaultTextLanguage
            OR :#{#filter.name?.languageCode} = titles_translations.language.code
        )
        WHERE titles_translations.text LIKE %:#{#filter.name?.text}%
    """
    )
    fun getPageByFilter(@Param("filter") filter: ResourceFilter, pageable: Pageable): Page<Resource>
}