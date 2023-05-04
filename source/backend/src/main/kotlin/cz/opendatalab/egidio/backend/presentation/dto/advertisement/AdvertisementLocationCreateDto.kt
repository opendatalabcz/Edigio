package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Structure for creation of location to which an advertisement is related"
)
data class AdvertisementLocationCreateDto (
    @Schema(
        description = "Location country",
        example = "Česká republika",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    var country: String,
    @Schema(
        description = "Location region",
        example = "Středočeský kraj",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var region: String? = null,
    @Schema(
        description = "Location city",
        example = "Sedlčany",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var city: String? = null,
    @Schema(
        description = "Location street",
        example = "Nádražní",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var street: String? = null,
    @Schema(
        description = "Location house number",
        example = "84",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var houseNumber: String? = null,
    @Schema(
        description = "Location postal code",
        example = "264 01",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var postalCode: String? = null,
)
