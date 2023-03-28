package cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text

import cz.opendatalab.egidio.backend.business.validation.user.MultilingualTextValidator
import jakarta.validation.Constraint

@Constraint(validatedBy = [MultilingualTextValidator::class])
annotation class MultilingualTextValid()
