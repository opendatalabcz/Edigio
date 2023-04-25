package cz.opendatalab.egidio.backend.presentation.controllers.advertisement_template

import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplatePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateShortDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementTemplateFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.http.ResponseEntity

/**
 * Controller for AdvertisementTemplate related actions
 */
interface AdvertisementTemplateController {
    /**
     * Create new advertisement template with data from DTO
     */
    fun create(createDto : AdvertisementTemplateCreateDto) : ResponseEntity<String>

    /**
     * Get page according to given filtered page request
     */
    fun getPageByFilter(
        filteredPageRequest : CustomFilteredPageRequest<AdvertisementTemplateFilter>
    ) : ResponseEntity<CustomPage<AdvertisementTemplateShortDto>>

    /**
     * Get preview data for AdvertisementTemplate with given slug
     */
    fun getPreview(slug : String) : ResponseEntity<AdvertisementTemplatePreviewDto>
}