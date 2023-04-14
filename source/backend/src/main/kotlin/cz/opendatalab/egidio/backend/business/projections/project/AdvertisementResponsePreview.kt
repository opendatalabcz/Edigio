package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus
import java.time.LocalDateTime
import java.util.*

data class AdvertisementResponsePreview(
    val publicId : UUID,
    val advertisement : ResponsePreviewAdvertisement,
    val listedItems : List<ResponseItem>,
    val responder : PublicUserInfo,
    val responderNote : String?,
    val advertiserNote : String?,
    val status : AdvertisementResponseStatus,
    val resolvableByUser : Boolean,
    val resolvableByToken : Boolean,
    val createdAt : LocalDateTime,
    val resolvedAt : LocalDateTime?,
)
