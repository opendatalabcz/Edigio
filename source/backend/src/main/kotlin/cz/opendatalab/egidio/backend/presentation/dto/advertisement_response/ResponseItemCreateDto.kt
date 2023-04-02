package cz.opendatalab.egidio.backend.presentation.dto.advertisement_response

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Positive

@Schema(
    name = "ResponseItemCreateDto",
    description = "DTO used to create item listed in creation"
)
data class ResponseItemCreateDto(
    @NotNull
    @NotBlank
    @Schema(
        name = "resouceSlug",
        description = "Slug of resource which is listed by this item"
    )
    val resourceSlug: String,
    @Nullable
    @Schema(
        name = "description",
        description = "Description related to concrete listed item",
        required = false
    )
    val description: String?,
    @NotNull
    @Positive
    @Schema(
        name = "amount",
        description = "Amount of instances listed by the item",
        minimum = "1",
        maximum = Int.MAX_VALUE.toString(),
    )
    val amount: Int
)