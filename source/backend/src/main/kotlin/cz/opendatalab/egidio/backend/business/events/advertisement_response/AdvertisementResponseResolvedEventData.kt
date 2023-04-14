package cz.opendatalab.egidio.backend.business.events.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import java.util.*

class AdvertisementResponseResolvedEventData(
    val publicId : UUID,
    val responsePreviewToken : String,
    val responderEmail : String,
    val advertisementTitle : MultilingualText,
    val advertisementSlug : String,
    val advertiserEmail : String,
    val isAccepted : Boolean
)