package cz.opendatalab.egidio.backend.business.event_listeners.advertisement

import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementResolvedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementEmailService
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementResolvedAdvertiserMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementResolvedEventListenersGroup(
    val advertisementEmailService : AdvertisementEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResolvedMailToAdvertiser(event : AdvertisementResolvedEvent) {
        advertisementEmailService.sendAdvertisementResolvedToAdvertiser(
            AdvertisementResolvedAdvertiserMessageData(
                advertiserEmail = event.data.advertiserEmail,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle
            )
        )
    }
}