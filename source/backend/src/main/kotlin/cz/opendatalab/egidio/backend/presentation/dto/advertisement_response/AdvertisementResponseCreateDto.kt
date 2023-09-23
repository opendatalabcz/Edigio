package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.presentation.dto.user.ContactCreateDto
import cz.opendatalab.egidio.backend.shared.validation.constants.AdvertisementResponseValidationConstants.RESPONDER_NOTE_MAX_LENGTH
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

@Schema(
    description = "DTO used to respond to the advertisement"
)
data class AdvertisementResponseCreateDto(
    @Schema(
        description = "Slug of advertisement for which the response is created",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val advertisementSlug : String,
    @field:Valid
    @Schema(
        description = "Contact to non-registered user. Must not be filled when user is logged in!",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val contact : ContactCreateDto,
    @field:NotNull
    @field:Valid
    @Schema(
        description = "Items listed in the response",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val listedItems : List<ResponseItemCreateDto>,
    @field:Nullable
    @field:Size( max = RESPONDER_NOTE_MAX_LENGTH )
    @Schema(
        description = "Note left by responder",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val note : String?
)