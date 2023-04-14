package cz.opendatalab.egidio.backend.business.events.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import java.util.*

data class AdvertisementResponsePublishedEventData(
    val rawPreviewToken : String?,
    val rawResolveToken : String?,
    val advertiserEmail : String,
    val responderEmail : String,
    val responsePublicId: UUID,
    val advertisementTitle : MultilingualText,
    val advertisementSlug : String
)