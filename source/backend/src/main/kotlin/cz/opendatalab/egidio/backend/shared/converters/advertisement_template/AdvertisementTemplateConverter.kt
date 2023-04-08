package cz.opendatalab.egidio.backend.shared.converters.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplatePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateShortDto

/**
 * Converter for [AdvertisementTemplate]
 */
interface AdvertisementTemplateConverter {
    /**
     * Convert [advertisementTemplate] to [AdvertisementTemplateShortDto]
     */
    fun entityToShortDto(advertisementTemplate: AdvertisementTemplate) : AdvertisementTemplateShortDto

    /**
     * Convert [advertisementTemplate] to [AdvertisementTemplatePreviewDto]
     */
    fun entityToPreviewDto(advertisementTemplate: AdvertisementTemplate) : AdvertisementTemplatePreviewDto
}