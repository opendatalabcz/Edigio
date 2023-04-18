package cz.opendatalab.egidio.backend.business.services.user.email.messages_data

data class EmailAddressChangeRequestCreatedCurrentAddressMessageData(
    val currentAddress: String,
    val username: String,
    val rawConfirmationToken: String
)
