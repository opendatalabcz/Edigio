package cz.opendatalab.egidio.backend.shared.filters

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import java.time.LocalDateTime

data class AdvertisementFilter(
    val text: MultilingualTextFilter?,
    val type: Set<AdvertisementType>?,
    val status: Set<AdvertisementStatus>?,
    val helpType: Set<AdvertisementHelpType>?,
    val projectSlug: String,
    val publishedAfter: LocalDateTime?,
    val publishedBefore: LocalDateTime?
)
