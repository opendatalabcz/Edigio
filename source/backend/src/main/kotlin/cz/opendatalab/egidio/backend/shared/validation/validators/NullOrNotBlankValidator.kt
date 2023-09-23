package cz.opendatalab.egidio.backend.shared.validation.validators

import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

/**
 * Validator that checks whether text is either null or not blank.
 */
class NullOrNotBlankValidator : ConstraintValidator<NullOrNotBlank, String> {
    override fun isValid(value : String?, context : ConstraintValidatorContext?) : Boolean {
        return value == null || value.isNotBlank()
    }
}