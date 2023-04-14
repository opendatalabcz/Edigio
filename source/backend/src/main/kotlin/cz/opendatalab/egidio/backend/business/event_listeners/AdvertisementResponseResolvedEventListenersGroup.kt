package cz.opendatalab.egidio.backend.business.event_listeners

import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseEmailService
import cz.opendatalab.egidio.backend.business.services.advertisement_response.email.AdvertisementResponseResolvedMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AdvertisementResponseResolvedEventListenersGroup(
    val advertisementResponseEmailService : AdvertisementResponseEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResponseResolvedToAdvertiser(event : AdvertisementResponseResolvedEvent) {
        this.advertisementResponseEmailService.sendAdvertisementResponseResolvedToAdvertiser(
            AdvertisementResponseResolvedMessageData(
                responsePreviewToken = event.data.responsePreviewToken,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle,
                advertiserEmail = event.data.advertiserEmail,
                responsePublicId = event.data.publicId,
                responderEmail = event.data.responderEmail,
                isAccepted = event.data.isAccepted
            )
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendAdvertisementResponseResolvedToResponder(event : AdvertisementResponseResolvedEvent) {
        this.advertisementResponseEmailService.sendAdvertisementResponseResolvedToResponder(
            AdvertisementResponseResolvedMessageData(
                responsePreviewToken = event.data.responsePreviewToken,
                advertisementSlug = event.data.advertisementSlug,
                advertisementTitle = event.data.advertisementTitle,
                advertiserEmail = event.data.advertiserEmail,
                responsePublicId = event.data.publicId,
                responderEmail = event.data.responderEmail,
                isAccepted = event.data.isAccepted
            )
        )
    }
}