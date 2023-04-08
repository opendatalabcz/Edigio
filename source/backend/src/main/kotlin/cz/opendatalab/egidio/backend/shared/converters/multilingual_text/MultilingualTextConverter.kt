package cz.opendatalab.egidio.backend.shared.converters.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.LocalizedTextDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

interface MultilingualTextConverter {
    fun convertLocalizedTextToDto(localizedText: LocalizedText): LocalizedTextDto
    fun convertMultilingualTextToDto(multilingualText: MultilingualText): MultilingualTextDto
}