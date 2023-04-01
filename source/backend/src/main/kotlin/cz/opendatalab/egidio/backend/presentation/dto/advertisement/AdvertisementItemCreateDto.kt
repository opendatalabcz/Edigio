package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.PositiveOrZero

data class AdvertisementItemCreateDto(
    @Schema
    val resourceSlug: String,
    @Schema(
        description = "Description of item instances",
        required = false,
        example = """{
            defaultLanguageCode: "en"
            texts: [
                { text: "All items are in pretty good shape", languageCode: "en" }
            ]
        }"""
    )
    val description: MultilingualTextCreateDto?,

    @PositiveOrZero
    @Schema(
        description = "Amount of item instances",
        example = "42",
        required = true,
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
    )
    val amount: Int
)
