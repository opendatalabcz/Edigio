package cz.opendatalab.egidio.backend.persistence.repositories.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AdvertisementRepository : JpaRepository<Advertisement, Long>, JpaSpecificationExecutor<Advertisement> {
    /**
     * Find all Advertisements that are in compliance with filter
     */
    @Query("""
         SELECT DISTINCT advertisement 
         FROM Advertisement advertisement
         JOIN advertisement.projects project
         JOIN advertisement.title.texts title_translations
         LEFT JOIN advertisement.description.texts description_translations
         WHERE project.slug = :#{#filter.projectSlug} 
            AND ( :#{#filter.type} IS NULL OR advertisement.type IN :#{#filter.type} )
            AND ( :#{#filter.helpType} IS NULL OR :#{#filter.helpType.empty} = true OR advertisement.helpType IN :#{#filter.helpType} )
            AND ( :#{#filter.status} IS NULL OR :#{#filter.status.empty} = true OR advertisement.status IN :#{#filter.status} )  
            AND (
                :#{#filter.text} IS NULL
                OR (advertisement.title.defaultText.text LIKE %:#{#filter.text.text}%)
                OR (
                    title_translations.language.code = :#{#filter.text.languageCode}
                    AND title_translations.text LIKE %:#{#filter.text.text}%                    
                )
                OR (advertisement.description.defaultText.text LIKE %:#{#filter.text.text}%)
                OR (
                    description_translations.language.code = :#{#filter.text.languageCode}
                    AND description_translations.text LIKE %:#{#filter.text.text}%                    
                )
            )
            AND ( :#{#filter.publishedAfter} IS NULL OR :#{#filter.publishedAfter} <= advertisement.lastApprovedAt )
            AND ( :#{#filter.publishedBefore} IS NULL OR :#{#filter.publishedBefore} >= advertisement.lastApprovedAt )
    """)
    fun findAllByFilter(@Param("filter") filter: AdvertisementFilter, pageable: Pageable): Page<Advertisement>

    fun getBySlug(@Param("slug") slug: String) : Advertisement
}