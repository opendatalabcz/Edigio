package cz.opendatalab.egidio.backend.business.validation.user

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@Size(min = 3, message = "Username is too short")
@Size(max = 12, message = "Username is too long")
@Pattern(regexp = "^[a-zA-Z0-9-]+$")
annotation class ValidUsername()
