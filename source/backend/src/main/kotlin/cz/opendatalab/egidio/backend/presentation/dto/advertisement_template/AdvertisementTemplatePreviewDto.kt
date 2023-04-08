package cz.opendatalab.egidio.backend.presentation.dto.advertisement_template

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class AdvertisementTemplatePreviewDto(
    val name: MultilingualTextDto,
    val description: MultilingualTextDto?,
    val slug: String,
)
