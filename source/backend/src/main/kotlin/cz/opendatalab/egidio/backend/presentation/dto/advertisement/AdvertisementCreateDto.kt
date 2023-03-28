package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto
import io.swagger.v3.oas.annotations.media.Schema

data class AdvertisementCreateDto(
    @Schema(
        description = "Title of advertisement. Should be something short and concise.",
        required = true
    )
    val title: MultilingualTextCreateDto,
    @Schema(
        description = "Description of advertisement",
        required = false
    )
    val description: MultilingualTextCreateDto?,
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
    val projectId: String
)