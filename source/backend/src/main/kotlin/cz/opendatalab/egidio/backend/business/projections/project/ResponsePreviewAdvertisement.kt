package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText

data class ResponsePreviewAdvertisement (
    val slug: String,
    val title: MultilingualText,
    val type: AdvertisementType,
)