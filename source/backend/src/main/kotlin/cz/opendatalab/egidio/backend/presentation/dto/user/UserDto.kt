package cz.opendatalab.egidio.backend.presentation.dto.user

data class UserDto(
    val username : String?,
    val firstname : String,
    val lastname : String,
    val email : String,
    val telephoneNumber : String?,
    val spokenLanguagesCodes : List<String>,
    val publishedContactDetailsSettings : PublishedContactDetailSettingsDto
)
