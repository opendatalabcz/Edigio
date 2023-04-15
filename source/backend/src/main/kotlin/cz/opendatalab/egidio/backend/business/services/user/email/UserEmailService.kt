package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.AnonymousUserEmailConfirmationRequestMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserContactConfirmedMessageData
import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.RegisteredUserEmailConfirmationRequestMessageData

interface UserEmailService {
    fun sendAnonymousUserEmailConfirmationRequestMessage(
        data: AnonymousUserEmailConfirmationRequestMessageData
    )

    fun sendUserRegisteredEmailConfirmationRequestMessage(
        data : RegisteredUserEmailConfirmationRequestMessageData
    )

    fun sendRegisteredUserEmailAddressConfirmedMessage(data : RegisteredUserContactConfirmedMessageData)
}