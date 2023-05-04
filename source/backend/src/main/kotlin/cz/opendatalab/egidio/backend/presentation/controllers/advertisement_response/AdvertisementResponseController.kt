package cz.opendatalab.egidio.backend.presentation.controllers.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponsePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import org.springframework.http.ResponseEntity
import java.util.*

/**
 * Controller handling requests related to [AdvertisementResponse]
 */
interface AdvertisementResponseController {

    /**
     * Creates new [AdvertisementResponse] with data from [createDto]
     */
    fun create(createDto : AdvertisementResponseCreateDto) : ResponseEntity<UUID>

    /**
     * Resolve response by accepting
     */
    fun accept(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    /**
     * Resolve response by rejecting
     */
    fun reject(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    /**
     * Get preview of [AdvertisementResponse] with [publicId].
     * Authorizes either against current user or [token]
     */
    fun getPreview(publicId : UUID, token : String? = null) : AdvertisementResponsePreviewDto
}