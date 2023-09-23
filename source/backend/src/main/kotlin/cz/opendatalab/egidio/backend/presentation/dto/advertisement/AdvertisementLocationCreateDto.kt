package cz.opendatalab.egidio.backend.presentation.dto.advertisement

import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.CITY_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.COUNTRY_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.HOUSE_NUMBER_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.POSTAL_CODE_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.REGION_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.constants.LocationValidationConstants.STREET_MAX_LENGTH
import cz.opendatalab.egidio.backend.shared.validation.validators.NullOrNotBlank
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Schema(
    description = "Structure for creation of location to which an advertisement is related"
)
data class AdvertisementLocationCreateDto (
    @field:NotNull
    @field:Size( max = COUNTRY_MAX_LENGTH )
    @Schema(
        description = "Location country",
        example = "Česká republika",
        requiredMode = Schema.RequiredMode.REQUIRED,
    )
    var country: String,
    @field:NullOrNotBlank
    @field:Size( max = REGION_MAX_LENGTH )
    @Schema(
        description = "Location region",
        example = "Středočeský kraj",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var region: String? = null,
    @field:NullOrNotBlank
    @field:Size( max = CITY_MAX_LENGTH )
    @Schema(
        description = "Location city",
        example = "Sedlčany",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var city: String? = null,
    @field:NullOrNotBlank
    @field:Size( max = STREET_MAX_LENGTH )
    @Schema(
        description = "Location street",
        example = "Nádražní",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var street: String? = null,
    @field:NullOrNotBlank
    @field:Size( max = HOUSE_NUMBER_MAX_LENGTH )
    @Schema(
        description = "Location house number",
        example = "84",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var houseNumber: String? = null,
    @field:NullOrNotBlank
    @field:Size( max = POSTAL_CODE_MAX_LENGTH )
    @Schema(
        description = "Location postal code",
        example = "264 01",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    var postalCode: String? = null,
)
