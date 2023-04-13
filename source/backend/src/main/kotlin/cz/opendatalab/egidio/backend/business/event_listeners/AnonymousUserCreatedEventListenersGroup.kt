package cz.opendatalab.egidio.backend.business.event_listeners

import cz.opendatalab.egidio.backend.business.events.user.AnonymousUserCreatedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.AnonymousUserEmailConfirmationRequestMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class AnonymousUserCreatedEventListenersGroup(
    val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    fun activateUserAdvertisementResponse(event : AnonymousUserCreatedEvent) {
        userEmailService.sendAnonymousUserEmailConfirmationRequestMessage(
            AnonymousUserEmailConfirmationRequestMessageData(
                publicId = event.data.publicId,
                email = event.data.email,
                rawEmailConfirmationTokenValue = event.data.rawEmailConfirmationTokenValue
            )
        )
    }
}