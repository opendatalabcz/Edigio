package cz.opendatalab.egidio.backend.presentation.dto.multilingual_text

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "DTO for multilingual text.")
data class MultilingualTextDto(
    @Schema(
        description = "Language code of default text language. Text with given language must be present in texts",
        required = true
    )
    val defaultLanguageCode: String,
    @Schema(
        description = "Texts in different languages. Languages must be unique",
        required = true
    )
    val texts: List<LocalizedTextDto>
) {
    /**
     * Returns first non blank text. In most cases that should be default text.
     *
     * @throws NoSuchElementException when no not blank string is found
     * @throws IllegalStateException when text in default language is not present
     */
    fun firstNonBlankText() : LocalizedTextDto {
        val default = checkNotNull(
            texts.find { it.languageCode == defaultLanguageCode },
            { "Text in default language not found!" }
        )
        return if(default.text.isNotBlank()) default else texts.first { it.text.isNotBlank() }
    }
}
