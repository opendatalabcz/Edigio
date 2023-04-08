package cz.opendatalab.egidio.backend.shared.converters.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformationLink
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationDto
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationLinkDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter

@ConverterComponent
class ImportantInformationConverterImpl(
    val multilingualTextConverter: MultilingualTextConverter
) : ImportantInformationConverter {

    override fun convertImportantInformationLinkToDto(
        importantInformationLink: ImportantInformationLink
    ): ImportantInformationLinkDto {
        return ImportantInformationLinkDto(
            title = multilingualTextConverter.convertMultilingualTextToDto(
                importantInformationLink.title
            ),
            location = importantInformationLink.location.toExternalForm()
        )
    }

    override fun convertImportantInformationToDto(importantInformation: ImportantInformation): ImportantInformationDto {
        return ImportantInformationDto(
            slug = importantInformation.slug,
            title = multilingualTextConverter.convertMultilingualTextToDto(importantInformation.title),
            text = multilingualTextConverter.convertMultilingualTextToDto(importantInformation.text),
            links = importantInformation.links.map(::convertImportantInformationLinkToDto)
        )
    }
}