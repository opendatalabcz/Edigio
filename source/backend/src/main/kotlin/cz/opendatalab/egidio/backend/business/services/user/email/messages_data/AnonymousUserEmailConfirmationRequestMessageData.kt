package cz.opendatalab.egidio.backend.business.services.user.email.messages_data

import java.util.UUID

data class AnonymousUserEmailConfirmationRequestMessageData(
    val publicId: UUID,
    val email: String,
    val rawEmailConfirmationTokenValue: String
)
