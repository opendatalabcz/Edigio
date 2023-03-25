package cz.opendatalab.egidio.backend.business.entities.advertisement.response

import com.fasterxml.jackson.annotation.JsonValue

enum class ResponseStatus(@JsonValue val value: String) {
    /**
     * Response was created, and now it's waiting for resolution by advertiser
     */
    WAITING("waiting"),

    /**
     * Response was rejected by advertiser
     */
    REJECTED("rejected"),

    /**
     * Response was accepted by advertiser
     */
    ACCEPTED("accepted")
}
