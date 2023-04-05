package cz.opendatalab.egidio.backend.shared.pagination

import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.PositiveOrZero

/**
 * Class for making request of certain page
 */
data class CustomPageRequest(
    @field:PositiveOrZero
    val idx: Int,

    @field:Positive(message = "Page size must be positive!")
    val size: Int
)