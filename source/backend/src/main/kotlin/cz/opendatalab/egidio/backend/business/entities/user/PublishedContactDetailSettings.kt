package cz.opendatalab.egidio.backend.business.entities.user

import jakarta.persistence.Basic
import jakarta.persistence.Embeddable

@Embeddable
class PublishedContactDetailSettings(
    @field:Basic
    val firstname: Boolean,
    @field:Basic
    val lastname: Boolean,
    @field:Basic
    val email: Boolean,
    @field:Basic
    val telephoneNumber: Boolean
) {
    companion object {
        const val FIRSTNAME_ATTRIBUTE_NAME = "firstname"
        const val LASTNAME_ATTRIBUTE_NAME = "lastname"
        const val EMAIL_ATTRIBUTE_NAME = "email"
        const val TELEPHONE_NUMBER_ATTRIBUTE_NAME = "telephoneNumber"
    }
}
