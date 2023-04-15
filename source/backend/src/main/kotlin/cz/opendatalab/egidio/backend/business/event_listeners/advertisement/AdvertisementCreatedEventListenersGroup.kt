package cz.opendatalab.egidio.backend.business.event_listeners.advertisement

import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementCreatedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementCreatedAdvertiserMessageData
import cz.opendatalab.egidio.backend.business.services.advertisement.email.AdvertisementEmailService
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementCreatedEventListenersGroup(
    val advertisementEmailService : AdvertisementEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementCreatedMailToAdvertiser(event : AdvertisementCreatedEvent) {
        advertisementEmailService.sendAdvertisementCreatedToAdvertiser(AdvertisementCreatedAdvertiserMessageData(
            cancelToken = event.data.rawCancelToken,
            resolveToken = event.data.rawResolveToken,
            advertiserEmail = event.data.advertiserEmail,
            advertisementSlug = event.data.advertisementSlug,
            advertisementTitle = event.data.advertisementTitle
        ))
    }
}