package cz.opendatalab.egidio.backend.business.entities.user

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

class SaltedPassword(
    @NotNull
    @NotBlank
    val password: String,
    @NotNull
    val salt: ByteArray
) {
    companion object {
        const val PASSWORD_ATTRIBUTE_NAME = "password"
        const val SALT_ATTRIBUTE_NAME = "salt"
    }
}