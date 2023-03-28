package cz.opendatalab.egidio.backend.presentation.dto.user

data class PublishedContactDetailSettingsDto(
    val firstname: Boolean,
    val lastname: Boolean,
    val email: Boolean,
    val telephoneNumber: Boolean
)
