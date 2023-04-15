package cz.opendatalab.egidio.backend.business.event_listeners.advertisement

import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementPublishedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementEmailService
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementPublishedAdvertiserMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementApprovedEventListenersGroup(
    val advertisementEmailService : AdvertisementEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementPublishedMailToAdvertiser(event : AdvertisementPublishedEvent) {
        advertisementEmailService.sendAdvertisementPublishedToAdvertiser(
            AdvertisementPublishedAdvertiserMessageData(
                advertiserEmail = event.data.advertiserEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }
}