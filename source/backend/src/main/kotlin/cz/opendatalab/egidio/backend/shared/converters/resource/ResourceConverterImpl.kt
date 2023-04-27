package cz.opendatalab.egidio.backend.shared.converters.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter

@ConverterComponent
class ResourceConverterImpl(
    private val multilingualTextConverter: MultilingualTextConverter
) : ResourceConverter {
    override fun convertToDto(resource: Resource): ResourceDto {
        return ResourceDto(
            name = multilingualTextConverter.convertMultilingualTextToDto(resource.name),
            description = multilingualTextConverter.convertMultilingualTextToDto(resource.description),
            slug = resource.slug
        )
    }

    override fun convertToShortDto(resource: Resource): ResourceShortDto {
        return ResourceShortDto(
            name = multilingualTextConverter.convertMultilingualTextToDto(resource.name),
            slug = resource.slug
        )
    }

}