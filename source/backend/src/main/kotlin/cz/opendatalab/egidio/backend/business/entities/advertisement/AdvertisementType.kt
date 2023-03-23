package cz.opendatalab.egidio.backend.business.entities.advertisement

import com.fasterxml.jackson.annotation.JsonValue

enum class AdvertisementType(@JsonValue val value: String) {
    OFFER("offer"),
    REQUEST("request")
}
