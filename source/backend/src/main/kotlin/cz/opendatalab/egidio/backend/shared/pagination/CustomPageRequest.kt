package cz.opendatalab.egidio.backend.shared.pagination

import jakarta.validation.constraints.PositiveOrZero

/**
 * Class for making request of certain page
 */
data class CustomPageRequest (
    @PositiveOrZero
    val idx: Int,

    @PositiveOrZero
    val size: Int
)