package cz.opendatalab.egidio.backend.presentation.dto.user

import cz.opendatalab.egidio.backend.business.validation.user.UserValidationPatterns
import cz.opendatalab.egidio.backend.business.validation.user.ValidPassword
import jakarta.annotation.Nullable
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

data class UserRegistrationDto(
    @NotNull
    val username: String,
    @NotNull
    @Pattern(regexp = UserValidationPatterns.NAME_PART)
    val firstname: String,
    @NotNull
    @Pattern(regexp = UserValidationPatterns.NAME_PART)
    val lastname: String,
    @NotNull
    @Email
    val email: String,
    @Nullable
    @Pattern(regexp = UserValidationPatterns.PHONE_NUMBER)
    val telephoneNumber: String?,
    @NotNull
    @ValidPassword
    val password: String,
)
