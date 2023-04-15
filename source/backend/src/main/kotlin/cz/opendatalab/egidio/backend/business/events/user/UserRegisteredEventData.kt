package cz.opendatalab.egidio.backend.business.events.user

import java.util.*

data class UserRegisteredEventData(
    val publicId : UUID,
    val email : String,
    val rawEmailConfirmationTokenValue : String
)
