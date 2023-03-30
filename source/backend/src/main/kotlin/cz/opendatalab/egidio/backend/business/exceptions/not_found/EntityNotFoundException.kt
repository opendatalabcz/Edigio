package cz.opendatalab.egidio.backend.business.exceptions.not_found

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.NOT_FOUND)
open class EntityNotFoundException(entityName: String)
    : Exception("${entityName.replaceFirstChar(Char::uppercase)} not found")
