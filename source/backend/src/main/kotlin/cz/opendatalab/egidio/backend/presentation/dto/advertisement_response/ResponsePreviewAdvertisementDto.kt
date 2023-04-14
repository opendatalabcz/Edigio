package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class ResponsePreviewAdvertisementDto (
    val slug: String,
    val title: MultilingualTextDto,
    val type: AdvertisementType,
)