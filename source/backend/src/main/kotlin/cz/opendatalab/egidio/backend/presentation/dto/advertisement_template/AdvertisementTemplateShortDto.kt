package cz.opendatalab.egidio.backend.presentation.dto.advertisement_template

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class AdvertisementTemplateShortDto(
    val name: MultilingualTextDto,
    val slug: String
)
