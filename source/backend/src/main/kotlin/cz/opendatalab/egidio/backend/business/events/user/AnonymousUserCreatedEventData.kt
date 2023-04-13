package cz.opendatalab.egidio.backend.business.events.user

import java.util.UUID

class AnonymousUserCreatedEventData(
    val publicId: UUID,
    val email: String,
    val rawEmailConfirmationTokenValue: String
)
