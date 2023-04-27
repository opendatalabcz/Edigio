package cz.opendatalab.egidio.backend.utils

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import org.assertj.core.api.Assertions.assertThat

class MultilingualTextTestUtils {
    companion object {
        fun assertMultilingualTextEqualToActualDto(
            text: MultilingualText,
            dto: MultilingualTextDto
        ) {
            assertThat(text.defaultTextLanguage.code)
                .isEqualTo(dto.defaultLanguageCode)
            val expectedTextsAndLangCodes = text.texts.map { it.language.code to it.text }
            val actualTextsAndLangCodes = dto.texts.map { it.languageCode to it.text }
            assertThat(actualTextsAndLangCodes)
                .describedAs("Actual MultilingualTextDto is different from MultilingualText (different available texts)")
                .containsExactlyInAnyOrderElementsOf(expectedTextsAndLangCodes)
        }
    }
}