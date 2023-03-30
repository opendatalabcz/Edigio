package cz.opendatalab.egidio.backend.business.exceptions.not_all_found

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(code = HttpStatus.NOT_FOUND)
open class NotAllEntitiesFound(entityName: String)
    : Exception("Not every given '${entityName.replaceFirstChar(Char::uppercase)}' found!.")
