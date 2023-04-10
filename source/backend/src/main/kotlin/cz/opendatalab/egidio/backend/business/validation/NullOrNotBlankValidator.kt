package cz.opendatalab.egidio.backend.business.validation

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.NullOrNotBlank
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class NullOrNotBlankValidator : ConstraintValidator<NullOrNotBlank, String> {
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        return value == null || value.isNotBlank()
    }
}