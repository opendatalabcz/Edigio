package cz.opendatalab.egidio.backend.business.services.advertisement_template

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementTemplateFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.annotation.security.PermitAll

/**
 * Service for [AdvertisementTemplate] entity
 */
interface AdvertisementTemplateService {
    @PermitCoordinator
    fun create(createDto : AdvertisementTemplateCreateDto) : AdvertisementTemplate

    @PermitAll
    fun getPageByFilter(filteredPageRequest : CustomFilteredPageRequest<AdvertisementTemplateFilter>) : CustomPage<AdvertisementTemplate>

    @PermitAll
    fun getBySlug(slug : String) : AdvertisementTemplate

    @PermitAll
    fun getRecommendedResources(templateSlug : String) : List<Resource>
}