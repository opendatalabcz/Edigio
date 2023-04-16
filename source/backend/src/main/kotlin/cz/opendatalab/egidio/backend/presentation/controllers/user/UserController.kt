package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.presentation.dto.user.*
import org.springframework.http.ResponseEntity
import java.util.*

interface UserController {
    fun register(registrationDto : UserRegistrationDto) : ResponseEntity<UUID>
    fun confirmEmail(publicId : UUID, token : String)
    fun getPublicUserInfo(publicId : UUID) : ResponseEntity<PublicUserInfoDto>
    fun getLoggedUserInfo() : ResponseEntity<LoggedUserInfoDto?>
    fun changeCurrentUserPublishedContactDetailSettings (
        updateDto : PublishedContactDetailSettingsUpdateDto
    )
    fun changeCurrentUserSpokenLanguages(languagesCodes : List<String>)
}