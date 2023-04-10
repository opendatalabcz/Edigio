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
         JOIN advertisement.title.texts title_translation
         JOIN advertisement.createdBy createdBy
         LEFT JOIN advertisement.description.texts description_translation
         WHERE ( :#{#filter.projectSlug == null} = true or project.slug = :#{#filter.projectSlug} ) 
            AND ( :#{#filter.type} IS NULL OR advertisement.type IN :#{#filter.type} )
            AND ( :#{#filter.helpType == null || #filter.helpType.empty} = true OR advertisement.helpType IN :#{#filter.helpType} )
            AND ( :#{#filter.status == null || #filter.status.empty} = true OR advertisement.status IN :#{#filter.status} )  
            AND (
                :#{#filter.text == null} = true
                OR (
                    (
                        title_translation.language.code = :#{#filter.text?.languageCode} 
                        OR title_translation.language = advertisement.title.defaultTextLanguage
                    )
                    AND title_translation.text LIKE %:#{#filter.text?.text}%
                )
                OR (
                    (
                        description_translation.language.code = :#{#filter.text?.languageCode}
                        OR description_translation.language = advertisement.description.defaultTextLanguage
                    )
                    AND description_translation.text LIKE %:#{#filter.text?.text}%
                )
            )
            AND ( :#{#filter.publishedAfter == null} = true OR :#{#filter.publishedAfter} <= advertisement.lastApprovedAt )
            AND ( :#{#filter.publishedBefore == null} = true OR :#{#filter.publishedBefore} >= advertisement.lastApprovedAt )
            AND ( :#{#filter.withConfirmedContactOnly} = false OR createdBy.emailConfirmed = true )
    """)
    fun findAllByFilter(@Param("filter") filter: AdvertisementFilter, pageable: Pageable): Page<Advertisement>

    fun findBySlug(@Param("slug") slug: String) : Advertisement?
}