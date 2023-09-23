package cz.opendatalab.egidio.backend.presentation.validation.validators

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextLength
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

/**
 * Validator that checks whether lengths contained in multilingual text have valid lengths
 */
class MultilingualTextDtoLengthValidator : ConstraintValidator<MultilingualTextLength, MultilingualTextDto> {

    private lateinit var validLengthsRange : IntRange

    override fun initialize(constraintAnnotation : MultilingualTextLength?) {
        super.initialize(constraintAnnotation)
        val minLength = constraintAnnotation?.min ?: 0
        val maxLength = constraintAnnotation?.max ?: Int.MAX_VALUE
        require(minLength <= maxLength) { "Min required length must be less or equal to max required length!" }
        validLengthsRange = minLength..maxLength
    }

    override fun isValid(value : MultilingualTextDto?, context : ConstraintValidatorContext?) : Boolean {
        return value == null || value.texts.all { validLengthsRange.contains(it.text.length) }
    }
}