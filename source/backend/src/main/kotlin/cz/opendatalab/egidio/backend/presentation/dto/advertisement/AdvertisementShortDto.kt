package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Shortened variant of Advertisement"
)
data class AdvertisementShortDto(
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val title : MultilingualTextDto,
    @Schema(
        description = "Description of advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val description : MultilingualTextDto?,
    @Schema(
        description = "Type of advertisement",
        example = "request, response",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val type : AdvertisementType,
    @Schema(
        description = "Slug which can be used to reference the advertisement",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val slug : String,
) {
}