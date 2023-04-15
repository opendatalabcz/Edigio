package cz.opendatalab.egidio.backend.business.exceptions.business.advertisement

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class PartiallyResolveAdvertisementCancelException
    : Exception("Tried to cancel [partially] resolved advertisement")