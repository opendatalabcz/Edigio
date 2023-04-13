package cz.opendatalab.egidio.backend.business.services.advertisement_response.email

interface AdvertisementResponseEmailService {
    fun sendAdvertisementResponseAvailableToAdvertiser(data : AdvertisementResponseAvailableAdvertiserMessageData)
}