package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import java.util.*

interface UserController {
    fun register(registrationDto: UserRegistrationDto): ResponseEntity<UUID>

    fun confirmEmail(publicId: UUID, token: UUID)
}