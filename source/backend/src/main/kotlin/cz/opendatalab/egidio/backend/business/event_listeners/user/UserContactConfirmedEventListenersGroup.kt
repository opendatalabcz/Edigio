package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.UserContactConfirmedEvent
import cz.opendatalab.egidio.backend.business.services.advertisement_response.AdvertisementResponseService
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserContactConfirmedMessageData
import jakarta.transaction.Transactional
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class UserContactConfirmedEventListenersGroup(
    val advertisementResponseService : AdvertisementResponseService,
    val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    fun activateUserAdvertisementResponse(event : UserContactConfirmedEvent) {
        //Must be in new transaction, so transaction-related events bound to publishing responses are triggered
        //Using AFTER_COMMIT to make sure the confirmation was saved before publishing user responses
        advertisementResponseService.tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId = event.data.userId)
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendRegisteredUserContactConfirmMessage(event : UserContactConfirmedEvent) {
        if(event.data.isRegistered) {
            userEmailService.sendRegisteredUserEmailAddressConfirmedMessage(
                RegisteredUserContactConfirmedMessageData(
                    email = event.data.userEmail
                )
            )
        }
    }
}