package cz.opendatalab.egidio.backend.presentation.controllers.user

import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.presentation.dto.user.*
import cz.opendatalab.egidio.backend.shared.converters.user.UserConverter
import cz.opendatalab.egidio.backend.shared.validation.constants.UserValidationConstants
import io.swagger.v3.oas.annotations.Operation
import jakarta.validation.Valid
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping(path = ["/user"])
class UserControllerImpl(
    val userService : UserService,
    val authenticationService : AuthenticationService,
    val userConverter : UserConverter
) : UserController {
    @Operation(summary = "Register new user")
    @PostMapping(
        name = "register_user",
        path = ["/register"]
    )
    override fun register(@Valid @RequestBody registrationDto : UserRegistrationDto) : ResponseEntity<UUID> {
        println("registering")
        return ResponseEntity.ok(
            userService.registerUser(userRegistrationDto = registrationDto).publicId
        )
    }

    @Operation(summary = "Confirm user email")
    @PostMapping(
        name = "confirm_registered_user_email",
        path = ["/{publicId}/confirm-email/{token}"]
    )
    @ResponseStatus(HttpStatus.OK)
    override fun confirmEmail(
        @PathVariable("publicId") publicId : UUID,
        @PathVariable("token") token : String
    ) {
        userService.confirmEmail(
            publicId = publicId,
            token = token
        )
    }

    @Operation(summary = "Get info about logged user")
    @GetMapping(
        name = "loggedUserInfo",
        path = ["/me/info"]
    )
    override fun getLoggedUserInfo() : ResponseEntity<LoggedUserInfoDto?> = ResponseEntity.ok(
        authenticationService.currentLoggedUserInfo()?.let(userConverter::loggedUserInfoToLoggedUserInfoDto)
    )

    @Operation(summary = "Change current user published contact details settings")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(
        name = "changeCurrentUserPublishedContactDetailSettings",
        path = ["/me/published-contact-detail-settings"]
    )
    override fun changeCurrentUserPublishedContactDetailSettings(
        @RequestBody updateDto : PublishedContactDetailSettingsUpdateDto
    ) {
        userService.changeCurrentUserPublishedContactDetailSettings(updateDto = updateDto)
    }


    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PutMapping(
        name = "changeCurrentUserSpokenLanguages",
        path = ["/me/spoken-languages"]
    )
    override fun changeCurrentUserSpokenLanguages(
        @RequestBody languagesCodes : List<String>
    ) {
        userService.changeCurrentUserSpokenLanguages(languagesCodes = languagesCodes)
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping(
        name = "requestCurrentUserEmailChange",
        path = ["/me/email/request"]
    )
    override fun requestCurrentUserEmailChange(
        @RequestBody
        @Size(max = UserValidationConstants.EMAIL_MAX_LENGTH)
        @Email
        newEmail : String
    ) {
        userService.createCurrentUserEmailChangeRequest(newEmail = newEmail)
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PostMapping(
        name = "requestCurrentUserEmailChange",
        path = ["/me/email/confirm/{currentEmailToken}/{newEmailToken}"]
    )
    override fun confirmCurrentUserEmailChange(
        @PathVariable currentEmailToken : String,
        @PathVariable newEmailToken : String
    ) {
        return userService.confirmCurrentUserEmailChangeRequest(
            currentEmailToken = currentEmailToken,
            newEmailToken = newEmailToken
        )
    }

    @GetMapping(
        name = "getPublicUserInfo",
        path = ["/{publicId}"]
    )
    override fun getPublicUserInfo(@PathVariable("publicId") publicId : UUID) : ResponseEntity<PublicUserInfoDto> {
        return ResponseEntity.ok(
            userService.getPublicUserInfoByPublicId(publicId = publicId).let(userConverter::publicInfoToPublicInfoDto)
        )
    }

    @PostMapping(
        name = "requestCurrentUserTelephoneNumberChange",
        path = ["/me/telephone-number/request"]
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    override fun requestCurrentUserTelephoneNumberChange(
        @RequestBody
        @Size(max = UserValidationConstants.TELEPHONE_NUMBER_MAX_LENGTH)
        @Pattern(regexp = UserValidationConstants.PHONE_NUMBER_REGEX)
        newNumber : String
    ) = userService.createCurrentUserTelephoneNumberChangeRequest(newNumber)


    @PostMapping(
        name = "confirmCurrentUserTelephoneNumberChange",
        path = ["/me/telephone-number/confirm/{confirmationToken}"]
    )
    @ResponseStatus(HttpStatus.NO_CONTENT)
    override fun confirmCurrentUserTelephoneNumberChange(@PathVariable("confirmationToken") confirmationToken : String) {
        this.userService.confirmCurrentUserTelephoneNumberChangeRequest(confirmationToken)
    }

    @Operation(summary = "Get details about current logged in user")
    @GetMapping(
        name = "getCurrentUserDetail",
        path = ["/me/detail"]
    )
    override fun getCurrentUser() : UserDto? {
        return this.authenticationService.currentLoggedInUser?.let(userConverter::userToUserDto)
    }
}