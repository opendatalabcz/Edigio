package cz.opendatalab.egidio.backend.business.event_listeners

import cz.opendatalab.egidio.backend.business.events.user.AdvertisementResponsePublishedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseAvailableAdvertiserMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseAvailableResponderMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseEmailService
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementResponsePublishedEventListener(
    val advertisementResponseEmailService : AdvertisementResponseEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResponseAvailableToAdvertiser(event : AdvertisementResponsePublishedEvent) {
        advertisementResponseEmailService.sendAdvertisementResponseAvailableToAdvertiser(
            AdvertisementResponseAvailableAdvertiserMessageData(
                responsePublicId = event.data.responsePublicId,
                rawPreviewToken = event.data.rawPreviewToken,
                rawResolveToken = event.data.rawResolveToken,
                advertiserEmail = event.data.advertiserEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResponseAvailableToResponder(event : AdvertisementResponsePublishedEvent) {
        advertisementResponseEmailService.sendAdvertisementResponseAvailableToResponder(
            AdvertisementResponseAvailableResponderMessageData(
                responsePublicId = event.data.responsePublicId,
                rawPreviewToken = event.data.rawPreviewToken,
                responderEmail = event.data.advertiserEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }
}