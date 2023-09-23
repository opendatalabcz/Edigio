package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextValid
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.annotation.Nullable

@Schema(description = "Filter for advertisements.")
data class ResourceFilter(
    @field:Nullable
    @field:MultilingualTextValid
    @Schema(
        description = "Name of resource",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val name: MultilingualTextFilter? = null,
) {
    companion object {
        fun of(): ResourceFilter {
            return ResourceFilter()
        }
    }
}
