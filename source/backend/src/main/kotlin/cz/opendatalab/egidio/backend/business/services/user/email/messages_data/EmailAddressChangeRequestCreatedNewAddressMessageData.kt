package cz.opendatalab.egidio.backend.business.services.user.email.messages_data

data class EmailAddressChangeRequestCreatedNewAddressMessageData(
    val newAddress: String,
    val username: String,
    val rawConfirmationToken: String
)
