package cz.opendatalab.egidio.backend.business.event_listeners.user

import cz.opendatalab.egidio.backend.business.events.user.PublishedContactDetailSettingsChangedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.PublishedContactDetailSettingsChangedMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class PublishedContactDetailSettingsChangedEventListenersGroup(
    private val userEmailService : UserEmailService
) {

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendPublishedContactDetailSettingsChanged(event : PublishedContactDetailSettingsChangedEvent) {
        this.userEmailService.sendPublishedContactDetailSettingsChanged(
            PublishedContactDetailSettingsChangedMessageData(
                email = event.data.email
            )
        )
    }
}