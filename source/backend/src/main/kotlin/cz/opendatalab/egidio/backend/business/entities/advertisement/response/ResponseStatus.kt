package cz.opendatalab.egidio.backend.business.entities.advertisement.response

import com.fasterxml.jackson.annotation.JsonValue

enum class ResponseStatus(@JsonValue val value: String) {
    /**
     * Response was created by anonymous user, and now it's waiting for user contact confirmation
     */
    WAITING_FOR_CONTACT_CONFIRMATION("waiting_for_user_contact_confirmation"),
    /**
     * Response was created, responder contact was confirmed, and now it's waiting for resolution by advertiser
     */
    WAITING_FOR_RESOLVE("waiting_for_resolve"),

    /**
     * Response was rejected by advertiser
     */
    REJECTED("rejected"),

    /**
     * Response was accepted by advertiser
     */
    ACCEPTED("accepted")
}
