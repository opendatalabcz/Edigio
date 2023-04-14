package cz.opendatalab.egidio.backend.presentation.controllers.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponsePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import org.springframework.http.ResponseEntity
import java.util.*

interface AdvertisementResponseController {
    //@PathVariable(name = "slug", required = true) slug: String
    fun getDetail(slug : UUID): ResponseEntity<AdvertisementResponseDto>

    fun create(createDto : AdvertisementResponseCreateDto) : ResponseEntity<UUID>

    fun accept(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    fun reject(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto)

    fun getPreview(publicId : UUID, token : String? = null) : AdvertisementResponsePreviewDto
}