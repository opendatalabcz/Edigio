package cz.opendatalab.egidio.backend.shared.pagination

import jakarta.validation.Valid
import jakarta.validation.constraints.PositiveOrZero

/**
 * Page of items
 *
 * This representation should be used whenever sending data out of the application,
 * as it's much simpler to process by frontend then regular [Pageable][org.springframework.data.domain.Pageable]
 */
data class CustomPage<T>(
    /**
     * Size of current page (max. number of items that can be placed on page)
     */
    @field:PositiveOrZero
    val size: Int,

    /**
     * Zero based page number
     */
    @field:PositiveOrZero
    val idx: Int,

    /**
     * Total number of items available for retrieval (pages count = ceil(totalItemsAvailable / size))
     */
    @field:PositiveOrZero
    val totalItemsAvailable: Long,

    @field:Valid
    val items: List<T>
) {
    fun <R> map(transform: (item: T) -> R): CustomPage<R> = CustomPage(
        size = size,
        idx = idx,
        totalItemsAvailable = totalItemsAvailable,
        items = items.map(transform)
    )
}