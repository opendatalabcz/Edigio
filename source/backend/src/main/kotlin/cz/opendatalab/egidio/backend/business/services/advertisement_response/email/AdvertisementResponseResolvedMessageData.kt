package cz.opendatalab.egidio.backend.business.services.advertisement_response.email

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import java.util.UUID

data class AdvertisementResponseResolvedMessageData(
    val advertisementSlug: String,
    val advertisementTitle: MultilingualText,
    val advertiserEmail: String,
    val responsePublicId: UUID,
    val responsePreviewToken: String,
    val responderEmail: String,
    val isAccepted: Boolean
)
