package cz.opendatalab.egidio.backend.presentation.dto.user

data class ContactCreateDto(
    val firstname: String,
    val lastname: String,
    val email: String,
    val telephoneNumber: String
)