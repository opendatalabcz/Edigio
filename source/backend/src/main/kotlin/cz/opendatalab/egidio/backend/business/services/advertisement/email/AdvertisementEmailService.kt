package cz.opendatalab.egidio.backend.business.services.advertisement.email

interface AdvertisementEmailService {
    fun sendAdvertisementCreatedToAdvertiser(data : AdvertisementCreatedAdvertiserMessageData)
}