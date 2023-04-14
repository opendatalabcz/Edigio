package cz.opendatalab.egidio.backend.business.services.advertisement_response.email

interface AdvertisementResponseEmailService {
    fun sendAdvertisementResponseAvailableToAdvertiser(data : AdvertisementResponseAvailableAdvertiserMessageData)
    fun sendAdvertisementResponseAvailableToResponder(data : AdvertisementResponseAvailableResponderMessageData)
    fun sendAdvertisementResponseResolvedToAdvertiser(data : AdvertisementResponseResolvedMessageData)
    fun sendAdvertisementResponseResolvedToResponder(data : AdvertisementResponseResolvedMessageData)
}