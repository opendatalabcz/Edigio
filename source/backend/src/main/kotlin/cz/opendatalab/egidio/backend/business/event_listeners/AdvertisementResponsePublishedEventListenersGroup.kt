package cz.opendatalab.egidio.backend.business.event_listeners

import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponsePublishedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseAvailableAdvertiserMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseAvailableResponderMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseEmailService
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementResponsePublishedEventListenersGroup(
    val advertisementResponseEmailService : AdvertisementResponseEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResponseAvailableToAdvertiser(event : AdvertisementResponsePublishedEvent) {
        println("Event 42")
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
        println("Event 501")
        advertisementResponseEmailService.sendAdvertisementResponseAvailableToResponder(
            AdvertisementResponseAvailableResponderMessageData(
                responsePublicId = event.data.responsePublicId,
                rawPreviewToken = event.data.rawPreviewToken,
                responderEmail = event.data.responderEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }
}