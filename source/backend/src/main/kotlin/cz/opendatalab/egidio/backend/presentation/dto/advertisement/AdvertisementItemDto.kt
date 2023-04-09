package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.PositiveOrZero

data class AdvertisementItemDto(
    @Schema(
        description = "Base resource of item"
    )
    val resource: ResourceShortDto,

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
    val description: MultilingualTextDto?,

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
