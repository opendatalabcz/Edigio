package cz.opendatalab.egidio.backend.presentation.controllers.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseDto
import org.springframework.http.ResponseEntity
import java.util.*

interface AdvertisementResponseController {
    //@PathVariable(name = "slug", required = true) slug: String
    fun getDetail(slug : UUID): ResponseEntity<AdvertisementResponseDto>

    fun create(createDto : AdvertisementResponseCreateDto) : ResponseEntity<UUID>

    fun accept(publicId : UUID, note : String, token : String?)

    fun reject(publicId : UUID, note : String, token : String?)
}