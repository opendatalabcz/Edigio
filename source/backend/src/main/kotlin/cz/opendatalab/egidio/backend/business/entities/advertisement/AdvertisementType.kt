package cz.opendatalab.egidio.backend.business.entities.advertisement

import com.fasterxml.jackson.annotation.JsonValue

/**
 * Type of [Advertisement]
 */
enum class AdvertisementType(@field:JsonValue val value: String) {
    /**
     * Advertisement offers something
     */
    OFFER("offer"),

    /**
     * Advertisement requests something
     */
    REQUEST("request")
}
