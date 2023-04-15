package cz.opendatalab.egidio.backend.business.exceptions.business.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.CONFLICT)
class AdvertisementActionNotAllowedForStatus(action: String, status: AdvertisementStatus)
    : Exception("Action '$action' is not valid for advertisement with status $status")