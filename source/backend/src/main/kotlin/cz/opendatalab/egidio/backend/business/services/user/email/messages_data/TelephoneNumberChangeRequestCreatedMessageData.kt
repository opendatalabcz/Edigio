package cz.opendatalab.egidio.backend.business.services.user.email.messages_data

data class TelephoneNumberChangeRequestCreatedMessageData(
    val email: String,
    val rawConfirmationToken: String
)
