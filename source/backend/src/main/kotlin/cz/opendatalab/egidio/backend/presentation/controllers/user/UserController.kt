package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto

interface UserController {
    fun register(registrationDto: UserRegistrationDto)
}