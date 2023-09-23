package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.shared.validation.constants.AdvertisementResponseValidationConstants.ADVERTISER_NOTE_MAX_LENGTH
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Size

@Schema(
    description = "Data needed while resolving AdvertisementResponse"
)
data class AdvertisementResponseResolveDataDto(
    @Schema(
        description = "Token used to resolve advertisement"
    )
    val token: String?,
    @field:Size( max = ADVERTISER_NOTE_MAX_LENGTH )
    @Schema(
        description = "Note made by advertiser for responder"
    )
    val note: String?,
)
