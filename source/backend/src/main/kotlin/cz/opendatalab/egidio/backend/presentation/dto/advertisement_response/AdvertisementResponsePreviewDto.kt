package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import io.swagger.v3.oas.annotations.media.Schema
import java.time.OffsetDateTime
import java.util.UUID

@Schema(
    description = "Preview variant of AdvertisementResponse"
)
data class AdvertisementResponsePreviewDto(
    @Schema(
        description = "Identifier that can be used to identify response",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val publicId : UUID,
    @Schema(
        description = "Advertisement for which response was made",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val advertisement : ResponsePreviewAdvertisementDto,
    @Schema(
        description = "AdvertisementResponse preview variant of an Advertisement",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val listedItems : List<ResponseItemDto>,
    @Schema(
        description = "Person who made the response",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val responder : PublicUserInfoDto,
    @Schema(
        description = "Note left by responder when he created the response",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val responderNote : String?,
    @Schema(
        description = "Note left by advertiser when he resolved the response",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val advertiserNote : String?,
    @Schema(
        description = "Note left by advertiser when he resolved the response",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val status : AdvertisementResponseStatus,
    @Schema(
        description = "Whether response is resolvable for current user (he must be either advertiser or coordinator/admin)",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val resolvableByUser : Boolean,
    @Schema(
        description = "Whether response is resolvable with given token",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val resolvableByToken : Boolean,
    @Schema(
        description = "Time of advertisement creation",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    val createdAt : OffsetDateTime,
    @Schema(
        description = "Whether response is resolvable with given token",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
    )
    val resolvedAt : OffsetDateTime?,
)