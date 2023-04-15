package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.presentation.dto.user.LoggedUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import org.springframework.http.ResponseEntity
import java.util.*

interface UserController {
    fun register(registrationDto: UserRegistrationDto): ResponseEntity<UUID>
    fun confirmEmail(publicId : UUID, token : String)
    fun getPublicUserInfo(publicId : UUID) : ResponseEntity<PublicUserInfoDto>
    fun getLoggedUserInfo() : ResponseEntity<LoggedUserInfoDto?>
}