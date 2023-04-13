package cz.opendatalab.egidio.backend.business.services.advertisement_response.email

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import java.util.UUID

data class AdvertisementResponseAvailableAdvertiserMessageData(
    val rawPreviewToken : String?,
    val rawResolveToken : String?,
    val advertiserEmail : String,
    val responsePublicId: UUID,
    val advertisementSlug: String,
    val advertisementTitle : MultilingualText
)
