package cz.opendatalab.egidio.backend.presentation.validation.validators

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextValid
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

/**
 * Validator that checks whether multilingual text is in valid state.
 */
class MultilingualTextDtoValidator : ConstraintValidator<MultilingualTextValid, MultilingualTextDto> {
    override fun isValid(value : MultilingualTextDto?, context : ConstraintValidatorContext?) : Boolean {
        return value == null || value.texts.any { it.languageCode === value.defaultLanguageCode }
    }
}