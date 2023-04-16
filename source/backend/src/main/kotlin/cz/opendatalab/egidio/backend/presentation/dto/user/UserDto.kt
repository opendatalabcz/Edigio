package cz.opendatalab.egidio.backend.presentation.dto.user

import java.util.UUID

data class UserDto(
    val publicId: UUID,
    val username : String?,
    val firstname : String,
    val lastname : String,
    val email : String,
    val telephoneNumber : String?,
    val spokenLanguagesCodes : List<String>,
    val publishedContactDetailsSettings : PublishedContactDetailSettingsDto
)
