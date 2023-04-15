package cz.opendatalab.egidio.backend.business.event_listeners.advertisement

import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementCanceledEvent
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementCanceledAdvertiserMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementEmailService
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementCanceledEventListenersGroup(
    val advertisementEmailService : AdvertisementEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementCanceledMailToAdvertiser(event : AdvertisementCanceledEvent) {
        advertisementEmailService.sendAdvertisementCanceledToAdvertiser(
            AdvertisementCanceledAdvertiserMessageData(
                advertiserEmail = event.data.advertiserEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }
}