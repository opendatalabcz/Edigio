package cz.opendatalab.egidio.backend.shared.validation.annotations

import cz.opendatalab.egidio.backend.business.validation.validators.MultilingualTextLengthValidator
import cz.opendatalab.egidio.backend.presentation.validation.validators.MultilingualTextDtoLengthValidator
import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

/**
 * Constraint which requires all texts contained in MultilingualText to have length
 * within required range
 */
@Constraint(validatedBy = [MultilingualTextLengthValidator::class, MultilingualTextDtoLengthValidator::class])
annotation class MultilingualTextLength(
    val message : String = "text for one or more languages has invalid length",
    val groups : Array<KClass<*>> = [],
    val payload : Array<KClass<out Payload>> = [],

    val min : Int = 0,
    val max : Int = Int.MAX_VALUE
)
