package cz.opendatalab.egidio.backend.business.services.advertisement.email

data class AdvertisementCreatedAdvertiserMessageData(
    val cancelToken: String,
    val resolveToken: String,
    val advertiserEmail: String,
    val advertisementSlug: String
)
