package cz.opendatalab.egidio.backend.shared.pagination

import jakarta.validation.constraints.PositiveOrZero

data class CustomPage<T>(
    /**
     * Size of current page (max. number of items that can be placed on page)
     */
    @PositiveOrZero
    val size: Int,

    /**
     * Zero based page number
     */
    @PositiveOrZero
    val idx: Int,

    /**
     * Total number of items available for retrieval (pages count = ceil(totalItemsAvailable / size))
     */
    @PositiveOrZero
    val totalItemsAvailable: Long,

    val items: List<T>
) {
    fun <R> map (transform: (item: T) -> R) : CustomPage<R>
    = CustomPage(
        size = size,
        idx = idx,
        totalItemsAvailable = totalItemsAvailable,
        items = items.map(transform)
    )
}