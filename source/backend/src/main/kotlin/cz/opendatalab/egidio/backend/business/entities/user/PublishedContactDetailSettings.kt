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
)
