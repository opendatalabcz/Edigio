package cz.opendatalab.egidio.backend.shared.converters.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplatePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateShortDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter

@ConverterComponent
class AdvertisementTemplateConverterImpl(
    val multilingualTextConverter: MultilingualTextConverter
) : AdvertisementTemplateConverter {
    override fun entityToShortDto(advertisementTemplate: AdvertisementTemplate): AdvertisementTemplateShortDto =
        AdvertisementTemplateShortDto(
            name = advertisementTemplate.name.let(multilingualTextConverter::convertMultilingualTextToDto),
            slug = advertisementTemplate.slug
        )

    override fun entityToPreviewDto(
        advertisementTemplate: AdvertisementTemplate
    ): AdvertisementTemplatePreviewDto =
        AdvertisementTemplatePreviewDto(
            name = advertisementTemplate.name.let(multilingualTextConverter::convertMultilingualTextToDto),
            description = advertisementTemplate.description?.let(multilingualTextConverter::convertMultilingualTextToDto),
            slug = advertisementTemplate.slug
        )
}