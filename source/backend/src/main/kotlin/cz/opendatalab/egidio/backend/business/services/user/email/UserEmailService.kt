package cz.opendatalab.egidio.backend.business.services.user.email

import cz.opendatalab.egidio.backend.business.services.user.email.messages_data.AnonymousUserEmailConfirmationRequestMessageData

interface UserEmailService {
    fun sendAnonymousUserEmailConfirmationRequestMessage(
        data: AnonymousUserEmailConfirmationRequestMessageData
    )
}