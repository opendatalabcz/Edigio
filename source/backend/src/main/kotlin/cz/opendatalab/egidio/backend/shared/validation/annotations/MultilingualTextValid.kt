package cz.opendatalab.egidio.backend.shared.validation.annotations

import cz.opendatalab.egidio.backend.business.validation.validators.MultilingualTextValidator
import cz.opendatalab.egidio.backend.presentation.validation.validators.MultilingualTextDtoValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

/**
 * Constraint which requires multilingual text to be in valid state
 */
@Constraint(validatedBy = [MultilingualTextValidator::class, MultilingualTextDtoValidator::class])
annotation class MultilingualTextValid(
    val message : String = "not valid multilingual text",
    val groups : Array<KClass<*>> = [],
    val payload : Array<KClass<out Payload>> = [],
)
