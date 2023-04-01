package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.presentation.dto.user.UserRegistrationDto
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping(path = ["/user"])
class UserControllerImpl(
    val userService: UserService
) : UserController {
    @PostMapping(
        name = "register_user",
        path = ["/register"]
    )
    override fun register(@RequestBody @Valid registrationDto: UserRegistrationDto) : ResponseEntity<UUID> {
        println("registering")
        return ResponseEntity.ok(userService.registerUser(registrationDto).publicId)
    }

    @PostMapping(
        name = "confirm_registered_user_email",
        path = ["/{publicId}/confirm-email/{token}"]
    )
    @ResponseStatus(HttpStatus.OK)
    override fun confirmEmail(
        @PathVariable("publicId") publicId: UUID,
        @PathVariable("token") token: UUID
    ) {
        userService.confirmEmail(
            publicId = publicId,
            token = token
        )
    }
}