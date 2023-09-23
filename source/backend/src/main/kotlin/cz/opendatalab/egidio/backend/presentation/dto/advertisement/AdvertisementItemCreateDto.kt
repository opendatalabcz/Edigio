package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextLength
import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextValid
import cz.opendatalab.egidio.backend.shared.validation.constants.AdvertisementItemValidationConstants.ADVERTISEMENT_ITEM_DESCRIPTION_MAX_LENGTH
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Positive

@Schema(description = "Detail of one item in advertisement")
data class AdvertisementItemCreateDto(
    @Schema
    val resourceSlug : String,

    @field:MultilingualTextValid
    @field:MultilingualTextLength(
        max = ADVERTISEMENT_ITEM_DESCRIPTION_MAX_LENGTH
    )
    @Schema(
        description = "Description of item instances",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description : MultilingualTextDto?,

    @field:Positive
    @Schema(
        description = "Amount of item instances",
        example = "42",
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val amount : Int
)
