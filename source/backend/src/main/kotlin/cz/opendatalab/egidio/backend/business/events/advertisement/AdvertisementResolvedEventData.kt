package cz.opendatalab.egidio.backend.business.events.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText

data class AdvertisementResolvedEventData(
    val advertisementSlug: String,
    val advertisementTitle: MultilingualText,
    val advertiserEmail: String
) {
    companion object {
        fun of(advertisement: Advertisement)
        = AdvertisementResolvedEventData(
            advertisementSlug = advertisement.slug,
            advertisementTitle = advertisement.title,
            advertiserEmail = advertisement.createdBy.email
        )
    }
}