package cz.opendatalab.egidio.backend.presentation.dto.multilingual_text

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "DTO for creation of Multilingual text.")
data class MultilingualTextCreateDto(
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
)
