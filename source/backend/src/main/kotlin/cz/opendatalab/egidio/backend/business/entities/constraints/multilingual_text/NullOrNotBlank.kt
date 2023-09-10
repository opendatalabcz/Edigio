package cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text

import cz.opendatalab.egidio.backend.business.validation.NullOrNotBlankValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

/**
 * Constraint which requires text to be either null or not blank
 */
@Constraint(validatedBy = [NullOrNotBlankValidator::class])
annotation class NullOrNotBlank(
    val message: String = "must be either null or not blank!",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
