package cz.opendatalab.egidio.backend.presentation.dto.multilingual_text

import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Text in single language"
)
data class LocalizedTextDto(
    @Schema(
        description = "Text value",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val text: String,
    @Schema(
        description = "Code of language of the text",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val languageCode: String,
)
