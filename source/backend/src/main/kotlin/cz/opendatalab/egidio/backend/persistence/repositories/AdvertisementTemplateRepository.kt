package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementTemplateFilter
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AdvertisementTemplateRepository : JpaRepository<AdvertisementTemplate, Long> {
    /**
     * Retrieves all advertisement templates,
     * that have project with given slug assigned and their type is according to filter
     * or these that have catastrophe type, help type and advertisement type assigned according to filter
     */
    @Query(
        """
        SELECT DISTINCT advertisementTemplate 
        FROM AdvertisementTemplate advertisementTemplate
        LEFT JOIN advertisementTemplate.catastropheTypes assigned_catastrophe_type
        LEFT JOIN advertisementTemplate.helpTypes assigned_advertisement_help_type
        LEFT JOIN advertisementTemplate.advertisementTypes assigned_advertisement_type
        LEFT JOIN advertisementTemplate.projects assigned_project
        JOIN advertisementTemplate.name.texts advertisement_template_name_translation
        WHERE (
            (
                :#{#filter.name == null} = true 
                OR ( 
                    (
                        advertisement_template_name_translation.language.code IN (
                            advertisementTemplate.name.defaultTextLanguage.code,
                            :#{#filter.name?.languageCode}
                        )
                    ) 
                    AND advertisement_template_name_translation.text ILIKE :#{#filter.name?.text}
                )
             )
            AND (
                (
                    (
                        :#{#filter.advertisementTypes == null} = true 
                        OR assigned_advertisement_type IN :#{#filter.advertisementTypes}
                    )
                    AND (
                        :#{#filter.projectsSlugs == null} = true
                        OR assigned_project IN :#{#filter.projectsSlugs}
                    )
                )
                OR (
                    (
                        :#{#filter.catastropheTypes == null} = true 
                        OR assigned_catastrophe_type IN :#{#filter.catastropheTypes}
                    )
                    AND (
                        :#{#filter.advertisementHelpTypes == null} = true 
                        OR assigned_advertisement_help_type IN :#{#filter.advertisementHelpTypes}
                    )
                    AND (
                        :#{#filter.advertisementTypes == null} = true 
                        OR assigned_advertisement_type IN :#{#filter.advertisementTypes}
                    )
                )
            )
        )
    """
    )
    fun getPageByFilter(
        @Param("filter") filter : AdvertisementTemplateFilter,
        page : Pageable
    ) : Page<AdvertisementTemplate>

    fun findBySlug(slug : String) : AdvertisementTemplate?

    @Query(
        """
        SELECT template.recommendedResources 
        FROM AdvertisementTemplate template
        WHERE template.slug = :templateSlug
    """
    )
    fun getRecommendedResources(templateSlug : String) : List<Resource>
}