package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import org.springframework.web.bind.annotation.RestController

@RestController
class UserControllerImpl(
    val userService: UserService
) : UserController {
    override fun register(registrationDto: UserRegistrationDto) {
        userService.registerUser(registrationDto)
    }
}