package cz.opendatalab.egidio.backend.business.services.advertisement.email

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText

data class AdvertisementCreatedAdvertiserMessageData(
    val cancelToken : String,
    val resolveToken : String,
    val advertiserEmail : String,
    val advertisementSlug : String,
    val advertisementTitle : MultilingualText
)
