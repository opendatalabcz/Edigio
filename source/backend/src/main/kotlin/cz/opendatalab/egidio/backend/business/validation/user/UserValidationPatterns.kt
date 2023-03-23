package cz.opendatalab.egidio.backend.business.validation.user

object UserValidationPatterns {
    @org.intellij.lang.annotations.Language("RegExp")
    const val PHONE_NUMBER: String = "^([+][0-9]+)?[0-9]+\$"

    @org.intellij.lang.annotations.Language("RegExp")
    const val NAME_PART: String = "^\\w+$"
}