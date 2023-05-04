package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.PositiveOrZero

data class AdvertisementItemDto(
    @Schema(
        description = "Base resource of item",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val resource: ResourceShortDto,

    @Schema(
        description = "Description of item instances",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description: MultilingualTextDto?,

    @field:PositiveOrZero
    @Schema(
        description = "Amount of item instances",
        example = "42",
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val amount: Int
)
