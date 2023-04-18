package cz.opendatalab.egidio.backend.business.event_listeners.user.change_request

import cz.opendatalab.egidio.backend.business.events.user.EmailChangeRequestConfirmedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.EmailAddressChangeRequestConfirmedNewAddressMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.EmailAddressChangeRequestConfirmedOldAddressMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class EmailChangeRequestConfirmedEventListenersGroup(
    private val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendEmailAddressChangeRequestConfirmedToOldAddress(event : EmailChangeRequestConfirmedEvent) {
        this.userEmailService.sendEmailAddressChangeRequestConfirmedToOldAddress(
            EmailAddressChangeRequestConfirmedOldAddressMessageData(
                oldAddress = event.data.oldEmail
            )
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendEmailAddressChangeRequestConfirmedToNewAddress(event : EmailChangeRequestConfirmedEvent) {
        this.userEmailService.sendEmailAddressChangeRequestConfirmedToNewAddress(
            EmailAddressChangeRequestConfirmedNewAddressMessageData(
                newAddress = event.data.newEmail
            )
        )
    }
}