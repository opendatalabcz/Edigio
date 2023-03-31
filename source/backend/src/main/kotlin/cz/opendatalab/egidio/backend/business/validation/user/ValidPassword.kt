package cz.opendatalab.egidio.backend.business.validation.user

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@Size(min = 8, message = "Password is too short")
@Size(max = 64, message = "Password is too long")
//Pattern that allows alphanumeric chars and special chars as described here
// https://owasp.org/www-community/password-special-characters
@Pattern(regexp = "^[a-zA-Z0-9]|[!\"#\$%&'()*+,-./:;<=>?@\\[\\]^_`{|}~\\\\]$")
annotation class ValidPassword()