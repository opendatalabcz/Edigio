package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.UserRegisteredEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserEmailConfirmationRequestMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class UserRegisteredEventListenersGroup(
    val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendUserRegisteredEmailConfirmationRequestMessage(event : UserRegisteredEvent) {
        userEmailService.sendUserRegisteredEmailConfirmationRequestMessage(
            RegisteredUserEmailConfirmationRequestMessageData(
                publicId = event.data.publicId,
                email = event.data.email,
                rawEmailConfirmationTokenValue = event.data.rawEmailConfirmationTokenValue
            )
        )
    }
}