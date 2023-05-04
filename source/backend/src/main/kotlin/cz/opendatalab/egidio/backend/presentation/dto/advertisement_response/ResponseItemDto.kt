package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive

@Schema(
    description = "DTO used to create item listed in creation"
)
data class ResponseItemDto(
    @field:NotNull
    @field:NotBlank
    @Schema(
        description = "Slug of resource which is listed by this item",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val resource: ResourceShortDto,

    @field:Nullable
    @Schema(
        description = "Description related to concrete listed item",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val description: String?,

    @field:NotNull
    @field:Positive
    @Schema(
        description = "Amount of instances listed by the item",
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val amount: Int
)
