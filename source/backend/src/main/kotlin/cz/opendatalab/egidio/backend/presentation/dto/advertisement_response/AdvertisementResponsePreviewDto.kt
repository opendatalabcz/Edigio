package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime
import java.util.UUID

@Schema(
    name = "AdvertisementResponseCreateDto",
    description = "DTO used to respond to the advertisement"
)
data class AdvertisementResponsePreviewDto(
    val publicId : UUID,
    val advertisement : ResponsePreviewAdvertisementDto,
    val listedItems : List<ResponseItemDto>,
    val responder : PublicUserInfoDto,
    val responderNote : String?,
    val advertiserNote : String?,
    val status : AdvertisementResponseStatus,
    val resolvableByUser : Boolean,
    val resolvableByToken : Boolean,
    val createdAt : LocalDateTime,
    val resolvedAt : LocalDateTime?,
)