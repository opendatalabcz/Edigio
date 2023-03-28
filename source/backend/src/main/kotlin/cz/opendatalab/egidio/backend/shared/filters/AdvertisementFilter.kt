package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import io.swagger.v3.oas.annotations.media.Schema
import java.time.LocalDateTime

@Schema(description = "Filter for advertisements.")
data class AdvertisementFilter(
    @Schema(description = "Text to search for in text")
    val text: MultilingualTextFilter? = null,
    val type: Set<AdvertisementType>? = null,
    val status: Set<AdvertisementStatus>? = null,
    val helpType: Set<AdvertisementHelpType>? = null,
    val projectSlug: String? = null,
    val publishedAfter: LocalDateTime? = null,
    val publishedBefore: LocalDateTime? = null
)
