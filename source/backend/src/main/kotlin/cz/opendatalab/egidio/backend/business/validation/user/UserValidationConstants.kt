package cz.opendatalab.egidio.backend.business.validation.user

object UserValidationConstants {
    @org.intellij.lang.annotations.Language("RegExp")
    const val PHONE_NUMBER: String = "^([+][0-9]+)?[0-9]+\$"

    @org.intellij.lang.annotations.Language("RegExp")
    const val NAME_PART: String = "^\\w+$"

    @org.intellij.lang.annotations.Language("RegExp")
    const val USERNAME_REGEX = "^[a-zA-Z0-9-]+$"

    const val USERNAME_MIN_LENGTH: Int = 3

    const val USERNAME_MAX_LENGTH: Int = 12

    const val PASSWORD_MIN_LENGTH: Int = 8

    const val PASSWORD_MAX_LENGTH: Int = 64

    const val PASSWORD_REGEX = "^([a-zA-Z0-9]|[!\"#\$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~\\\\])+$"
}