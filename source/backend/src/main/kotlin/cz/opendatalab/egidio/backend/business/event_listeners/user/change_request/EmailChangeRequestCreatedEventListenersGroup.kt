package cz.opendatalab.egidio.backend.business.event_listeners.user.change_request

import cz.opendatalab.egidio.backend.business.events.user.EmailChangeRequestCreatedEvent
import cz.opendatalab.egidio.backend.business.services.user.email.UserEmailService
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.EmailAddressChangeRequestCreatedCurrentAddressMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.EmailAddressChangeRequestCreatedNewAddressMessageData
import org.springframework.stereotype.Component
import org.springframework.transaction.event.TransactionPhase
import org.springframework.transaction.event.TransactionalEventListener

@Component
class EmailChangeRequestCreatedEventListenersGroup(
    private val userEmailService : UserEmailService
) {
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendEmailAddressChangeRequestCreatedToCurrentAddress(event : EmailChangeRequestCreatedEvent) {
        this.userEmailService.sendEmailAddressChangeRequestCreatedToCurrentAddress(
            EmailAddressChangeRequestCreatedCurrentAddressMessageData(
                currentAddress = event.data.currentEmail,
                username = event.data.username,
                rawConfirmationToken = event.data.rawCurrentEmailConfirmationToken
            )
        )
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    fun sendEmailAddressChangeRequestCreatedToNewAddress(event : EmailChangeRequestCreatedEvent) {
        this.userEmailService.sendEmailAddressChangeRequestCreatedToNewAddress(
            EmailAddressChangeRequestCreatedNewAddressMessageData(
                newAddress = event.data.newEmail,
                username = event.data.username,
                rawConfirmationToken = event.data.rawNewEmailConfirmationToken
            )
        )
    }
}