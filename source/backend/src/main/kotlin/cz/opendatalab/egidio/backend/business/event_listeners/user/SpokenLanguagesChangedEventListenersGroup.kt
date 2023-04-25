package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.SpokenLanguagesChangedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.SpokenLanguagesChangedMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class SpokenLanguagesChangedEventListenersGroup(
    private val userEmailService : UserEmailService
) {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendSpokenLanguagesSettingsChanged(event : SpokenLanguagesChangedEvent) {
        this.userEmailService.sendSpokenLanguagesSettingsChanged(
            SpokenLanguagesChangedMessageData(email = event.data.email)
        )
    }
}