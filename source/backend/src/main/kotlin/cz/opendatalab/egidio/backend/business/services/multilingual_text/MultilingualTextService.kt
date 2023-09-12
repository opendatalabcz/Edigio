package cz.opendatalab.egidio.backend.business.services.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import jakarta.annotation.security.PermitAll

/**
 * Service for [MultilingualText] entity
 */
interface MultilingualTextService {
    @PermitAll
    fun create(createDto: MultilingualTextDto): MultilingualText
}