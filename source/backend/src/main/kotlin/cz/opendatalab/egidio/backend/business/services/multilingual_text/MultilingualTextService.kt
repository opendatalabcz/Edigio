package cz.opendatalab.egidio.backend.business.services.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto

interface MultilingualTextService {
    fun create(createDto: MultilingualTextCreateDto): MultilingualText
}