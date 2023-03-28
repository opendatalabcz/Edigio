package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import io.swagger.v3.oas.annotations.media.Schema

@Schema(description = "Location to which advertisement is related")
data class AdvertisementLocationCreateDto (
    @Schema(required = true)
    var country: String,
    @Schema(required = false)
    var region: String? = null,
    @Schema(required = false)
    var city: String? = null,
    @Schema(required = false)
    var street: String? = null,
    @Schema(required = false)
    var houseNumber: String? = null,
    @Schema(required = false)
    var postalCode: String? = null,
)
