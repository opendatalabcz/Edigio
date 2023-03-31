package cz.opendatalab.egidio.backend.shared.pagination

import jakarta.annotation.Nullable
import jakarta.validation.Valid

/**
 * Class for making request of certain page
 */
data class CustomFilteredPageRequest<FilterType>(
    @field:Valid val pageRequest: CustomPageRequest,
    @field:Valid @field:Nullable val filter: FilterType?
)