package cz.opendatalab.egidio.backend.business.event_listeners.user.change_request

import cz.opendatalab.egidio.backend.business.events.user.TelephoneNumberChangeRequestConfirmedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.TelephoneNumberChangeRequestConfirmedMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class TelephoneNumberChangRequestConfirmedEventListenersGroup(
    private val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendTelephoneNumberChangeRequestConfirmed(event : TelephoneNumberChangeRequestConfirmedEvent) {
        this.userEmailService.sendTelephoneNumberChangeRequestConfirmed(
            TelephoneNumberChangeRequestConfirmedMessageData(
                email = event.data.email
            )
        )
    }
}