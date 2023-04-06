package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable

@Schema(description = "Filter for advertisements.")
data class ResourceFilter(
    @field:Nullable
    @field:MultilingualTextValid
    @field:Schema(description = "Name of resource")
    val name: MultilingualTextFilter? = null,
) {
    companion object {
        fun of(): ResourceFilter {
            return ResourceFilter()
        }
    }
}
