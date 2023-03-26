package cz.opendatalab.egidio.backend.business.exceptions

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.NOT_FOUND)
class EntityNotFoundException(entityName: String)
    : Exception("${entityName.replaceFirstChar(Char::uppercase)} not found")
