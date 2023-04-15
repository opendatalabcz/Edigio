package cz.opendatalab.egidio.backend.business.events.user

data class UserContactConfirmedEventData(
    val userId: Long,
    val userEmail: String,
    val isRegistered: Boolean
)
