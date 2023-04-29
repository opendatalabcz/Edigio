package cz.opendatalab.egidio.backend.business.events.user

import java.util.UUID

class NonRegisteredUserCreatedEventData(
    val publicId: UUID,
    val email: String,
    val rawEmailConfirmationTokenValue: String
)
