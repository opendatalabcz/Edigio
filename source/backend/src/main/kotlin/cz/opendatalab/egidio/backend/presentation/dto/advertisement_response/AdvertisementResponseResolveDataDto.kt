package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Data needed while resolving AdvertisementResponse"
)
data class AdvertisementResponseResolveDataDto(
    @Schema(
        description = "Token used to resolve advertisement"
    )
    val token: String?,
    @Schema(
        description = "Note made by advertiser for responder"
    )
    val note: String?
)
