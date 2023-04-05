package cz.opendatalab.egidio.backend.presentation.dto.important_information

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ImportantInformationDto(
    val title: MultilingualTextDto,
    val text: MultilingualTextDto,
    val links: List<ImportantInformationLinkDto>
)
