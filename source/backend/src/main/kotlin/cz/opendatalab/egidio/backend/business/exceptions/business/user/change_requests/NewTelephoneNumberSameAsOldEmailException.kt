package cz.opendatalab.egidio.backend.business.exceptions.business.user.change_requests

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class NewTelephoneNumberSameAsOldEmailException() : Exception("Given telephone number is same as old telephone number")