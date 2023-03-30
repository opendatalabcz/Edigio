package cz.opendatalab.egidio.backend.presentation.controllers

import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import org.springframework.http.ResponseEntity
import java.util.*

interface AdvertisementController {
    //@PathVariable(name = "slug", required = true) slug: String
    fun getAdvertisementDetail(slug: String): ResponseEntity<*>

    fun getAdvertisement(pageRequest: CustomPageRequest, filter: AdvertisementFilter?): ResponseEntity<*>

    fun createAdvertisement(advertisementCreateDto: AdvertisementCreateDto)

    fun publishAdvertisement(slug: String, token: UUID?)

    fun cancelAdvertisement(slug: String, token: String?)
}