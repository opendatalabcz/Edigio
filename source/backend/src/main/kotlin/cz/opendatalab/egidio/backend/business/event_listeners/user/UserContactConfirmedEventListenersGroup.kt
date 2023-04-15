package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.UserContactConfirmedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.AdvertisementResponseService
import jakarta.transaction.Transactional
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class UserContactConfirmedEventListenersGroup(
    val advertisementResponseService : AdvertisementResponseService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    fun activateUserAdvertisementResponse(event : UserContactConfirmedEvent) {
        advertisementResponseService.tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId = event.userId)
    }
}