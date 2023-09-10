package cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text

import cz.opendatalab.egidio.backend.business.validation.MultilingualTextValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

/**
 * Constraint which requires multilingual text to be in valid state
 */
@Constraint(validatedBy = [MultilingualTextValidator::class])
annotation class MultilingualTextValid(
    val message: String = "not valid multilingual text",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)
