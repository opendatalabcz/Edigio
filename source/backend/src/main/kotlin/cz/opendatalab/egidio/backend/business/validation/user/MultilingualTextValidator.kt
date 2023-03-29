package cz.opendatalab.egidio.backend.business.validation.user

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class MultilingualTextValidator : ConstraintValidator<MultilingualTextValid, MultilingualText> {
    override fun isValid(value: MultilingualText?, context: ConstraintValidatorContext?): Boolean {
        return value == null || value.texts.any { it.language === value.defaultTextLanguage }
    }
}