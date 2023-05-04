package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "AdvertisementResponse preview variant of Advertisement"
)
data class ResponsePreviewAdvertisementDto (
    val slug: String,
    val title: MultilingualTextDto,
    val type: AdvertisementType,
)