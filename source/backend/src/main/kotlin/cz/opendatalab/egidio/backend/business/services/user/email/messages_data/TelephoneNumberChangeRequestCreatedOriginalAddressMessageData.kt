package cz.opendatalab.egidio.backend.business.services.user.email.messages_data

data class TelephoneNumberChangeRequestCreatedOriginalAddressMessageData(
    val email: String,
    val username: String,
    val rawConfirmationToken: String
)
