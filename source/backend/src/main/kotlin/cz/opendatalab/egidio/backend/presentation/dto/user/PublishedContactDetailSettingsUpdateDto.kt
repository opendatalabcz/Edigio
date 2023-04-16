package cz.opendatalab.egidio.backend.presentation.dto.user

data class PublishedContactDetailSettingsUpdateDto(
    val lastname: Boolean,
    val email: Boolean,
    val telephoneNumber: Boolean
)
