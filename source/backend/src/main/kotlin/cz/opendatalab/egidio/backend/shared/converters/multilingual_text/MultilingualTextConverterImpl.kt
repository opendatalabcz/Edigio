package cz.opendatalab.egidio.backend.shared.converters.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.LocalizedTextDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent

@ConverterComponent
class MultilingualTextConverterImpl : MultilingualTextConverter {
    override fun convertLocalizedTextToLocalizedTextDto(localizedText: LocalizedText): LocalizedTextDto =
        LocalizedTextDto(text = localizedText.text, languageCode = localizedText.language.code)

    override fun convertMultilingualTextToMultilingualTextDto(multilingualText: MultilingualText): MultilingualTextDto =
        MultilingualTextDto(
            defaultLanguageCode = multilingualText.defaultTextLanguage.code,
            texts = multilingualText.texts.map(this::convertLocalizedTextToLocalizedTextDto)
        )
}