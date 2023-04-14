package cz.opendatalab.egidio.backend.business.services.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.projections.project.AdvertisementResponsePreview
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import jakarta.annotation.security.PermitAll
import java.util.*

/**
 * Service for AdvertisementResponse entity
 */
interface AdvertisementResponseService {
    @PermitAll
    fun getByPublicId(publicId: UUID, token: String?): AdvertisementResponse

    @PermitAll
    fun createResponse(createDto: AdvertisementResponseCreateDto): AdvertisementResponse

    @PermitAll
    fun acceptResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    @PermitAll
    fun rejectResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    @PermitAll
    fun tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId: Long)

    @PermitAll
    fun getPreviewByPublicIdAndWithOptionalToken(publicId : UUID, token : String?) : AdvertisementResponsePreview
}