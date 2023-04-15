package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

data class AdvertisementShortDto(
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        required = true
    )
    val title : MultilingualTextDto,
    @Schema(
        description = "Description of advertisement",
        required = false
    )
    val description : MultilingualTextDto?,
    @Schema(
        description = "Type of advertisement",
        example = "request, response"
    )
    val type : AdvertisementType,
    @Schema(
        description = "Slug which can be used to reference the advertisement"
    )
    val slug : String,
) {
}