package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull

@Schema(
    name = "AdvertisementResponseCreateDto",
    description = "DTO used to respond to the advertisement"
)
data class AdvertisementResponseDto(
    @field:Schema(
        name = "advertisementSlug",
        description = "Slug of advertisement for which the response is created"
    )
    val advertisementSlug: String,
    @field:Schema(
        name = "anonymousUserCreateDto",
        description = "Info about anonymous responder. Must not be filled when user is logged in!"
    )
    val anonymousUserInfoCreateDto: AnonymousUserInfoCreateDto,
    @field:NotNull
    @field:Schema(
        name = "responseItemCreateDto",
        description = "Items listed in the response",
    )
    val listedItems: List<ResponseItemCreateDto>,
    @field:Schema(
        description = "Not made by responder for advertiser"
    )
    val note: String?
)