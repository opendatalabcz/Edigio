package cz.opendatalab.egidio.backend.business.services.advertisement.email

interface AdvertisementEmailService {
    fun sendAdvertisementCreatedToAdvertiser(data : AdvertisementCreatedAdvertiserMessageData)
    fun sendAdvertisementPublishedToAdvertiser(data: AdvertisementPublishedAdvertiserMessageData)
    fun sendAdvertisementResolvedToAdvertiser(data : AdvertisementResolvedAdvertiserMessageData)
    fun sendAdvertisementCanceledToAdvertiser(data : AdvertisementCanceledAdvertiserMessageData)
}