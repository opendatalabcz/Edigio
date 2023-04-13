package cz.opendatalab.egidio.backend.business.event_listeners

import cz.opendatalab.egidio.backend.business.events.user.UserContactConfirmedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.AdvertisementResponseService
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class UserContactConfirmedEventListenersGroup(
    val advertisementResponseService : AdvertisementResponseService
) {
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    fun activateUserAdvertisementResponse(event : UserContactConfirmedEvent) {
        advertisementResponseService.tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId = event.userId)
    }
}