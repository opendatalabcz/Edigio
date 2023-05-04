package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.PositiveOrZero

@Schema(description = "Detail of one item in advertisement")
data class AdvertisementItemCreateDto(
    @field:Schema
    val resourceSlug : String,

    @field:Schema(
        description = "Description of item instances",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description : MultilingualTextDto?,

    @field:PositiveOrZero
    @field:Schema(
        description = "Amount of item instances",
        example = "42",
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val amount : Int
)
