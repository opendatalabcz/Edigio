package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.shared.filters.MultilingualTextFilter
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ResourceRepository : JpaRepository<Resource, Long> {
    fun getBySlug(@Param("slug") slug: String): Resource
    @Query("""
        SELECT DISTINCT resource
        FROM Resource resource
        JOIN resource.name.texts titles_translations ON (
            titles_translations.language = resource.name.defaultTextLanguage
            OR :#{#nameFilter.languageCode} = titles_translations.language.code
        )
        WHERE titles_translations.text LIKE %:#{#nameFilter.text}%
    """)
    fun findAllByNameLike(@Param("nameFilter") nameFilter: MultilingualTextFilter)
}