package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

data class AdvertisementCreateDto(
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        required = true
    )
    val title: MultilingualTextDto,
    @Schema(
        description = "Description of advertisement",
        required = false
    )
    val description: MultilingualTextDto?,
    @Schema(
        description = "Location to which advertisement is created"

    )
    val location: AdvertisementLocationCreateDto,
    @Schema(
        description = "Information used to create anonymous user. Omitted when user is logged in.",
        required = false
    )
    val anonymousUserInfo: AnonymousUserInfoCreateDto?,
    @Schema(
        description = "ID of project to which advertisement belongs. Omitted when user is logged in.",
        required = false
    )
    val projectId: String,
    @Schema(
        description = "Type of advertisement",
        example = "order,authentication"
    )
    val type: AdvertisementType,
    @Schema(
        description = "Type of help contained in advertisement",
    )
    val helpType: AdvertisementHelpType,
    @Schema(
        description = "Items contained in advertisement"
    )
    val items: List<AdvertisementItemCreateDto>
) {
}