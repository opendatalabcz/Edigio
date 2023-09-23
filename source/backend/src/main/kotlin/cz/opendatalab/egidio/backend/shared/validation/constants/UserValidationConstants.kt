package cz.opendatalab.egidio.backend.shared.validation.constants

object UserValidationConstants {
    @org.intellij.lang.annotations.Language("RegExp")
    const val PHONE_NUMBER_REGEX: String = "^([+][0-9]+)?[0-9]+?\$"

    @org.intellij.lang.annotations.Language("RegExp")
    const val USERNAME_REGEX = "^[a-zA-Z0-9-]+$"

    const val USERNAME_MIN_LENGTH: Int = 3

    const val USERNAME_MAX_LENGTH: Int = 24

    const val PASSWORD_MIN_LENGTH: Int = 8

    const val PASSWORD_MAX_LENGTH: Int = 64

    const val PASSWORD_REGEX = "^([a-zA-Z0-9]|[!\"#\$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~\\\\])+$"

    const val FIRSTNAME_MAX_LENGTH = 255

    const val LASTNAME_MAX_LENGTH = 255

    const val EMAIL_MAX_LENGTH = 255

    const val TELEPHONE_NUMBER_MAX_LENGTH = 255
}