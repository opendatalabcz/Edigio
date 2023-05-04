package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.presentation.dto.user.ContactCreateDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotNull

@Schema(
    description = "DTO used to respond to the advertisement"
)
data class AdvertisementResponseCreateDto(
    @Schema(
        description = "Slug of advertisement for which the response is created",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val advertisementSlug : String,
    @Schema(
        description = "Contact to non-registered user. Must not be filled when user is logged in!",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val contact : ContactCreateDto,
    @field:NotNull
    @Schema(
        description = "Items listed in the response",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val listedItems : List<ResponseItemCreateDto>,
    @Schema(
        description = "Note left by responder",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val note : String?
)