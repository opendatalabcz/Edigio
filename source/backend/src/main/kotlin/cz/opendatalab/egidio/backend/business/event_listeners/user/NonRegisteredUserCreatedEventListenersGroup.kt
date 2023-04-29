package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.NonRegisteredUserCreatedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.NonRegisteredUserEmailConfirmationRequestMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class NonRegisteredUserCreatedEventListenersGroup(
    val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun activateUserAdvertisementResponse(event : NonRegisteredUserCreatedEvent) {
        userEmailService.sendNonRegisteredUserEmailConfirmationRequestMessage(
            NonRegisteredUserEmailConfirmationRequestMessageData(
                publicId = event.data.publicId,
                email = event.data.email,
                rawEmailConfirmationTokenValue = event.data.rawEmailConfirmationTokenValue
            )
        )
    }
}