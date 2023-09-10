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
    /**
     * Get single [AdvertisementResponse] by its public ID.
     *
     * As [AdvertisementResponse] is only accessible to advertiser, responser, coordinators and admin,
     * user must either be one of those or he must give us valid token.
     */
    @PermitAll
    fun getByPublicId(publicId: UUID, token: String?): AdvertisementResponse

    /**
     * Get single [AdvertisementResponse] by its public ID.
     *
     * As [AdvertisementResponse] is only accessible to advertiser, responser, coordinators and admin,
     * user must either be one of those or he must give us valid token.
     */
    @PermitAll
    fun createResponse(createDto: AdvertisementResponseCreateDto): AdvertisementResponse

    /**
     * Make [AdvertisementResponse] with given [publicId] accepted,
     * and filled with data from [resolveDataDto].
     */
    @PermitAll
    fun acceptResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    /**
     * Make [AdvertisementResponse] with given [publicId] rejected,
     * and filled with data from [resolveDataDto]
     */
    @PermitAll
    fun rejectResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    /**
     * Publishes all responses that belong to user with given [userId], and were not published yet.
     */
    @PermitAll
    fun tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId: Long)

    /**
     * Get [AdvertisementResponsePreview] with given [publicId].
     * User must either have high enough role (coordinator+) or he must have a valid token to access the response.
     */
    @PermitAll
    fun getPreviewByPublicIdAndWithOptionalToken(publicId : UUID, token : String?) : AdvertisementResponsePreview
}