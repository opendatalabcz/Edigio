package cz.opendatalab.egidio.backend.business.exceptions.not_unique

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.BAD_REQUEST)
open class NotUniqueException(what: String) : Exception("${what} not unique!")