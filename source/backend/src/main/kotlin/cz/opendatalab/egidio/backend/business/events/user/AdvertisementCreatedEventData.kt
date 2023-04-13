package cz.opendatalab.egidio.backend.business.events.user

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText

data class AdvertisementCreatedEventData(
    val rawCancelToken : String,
    val rawResolveToken : String,
    val advertiserEmail : String,
    val advertisementSlug : String,
    val advertisementTitle : MultilingualText
)
