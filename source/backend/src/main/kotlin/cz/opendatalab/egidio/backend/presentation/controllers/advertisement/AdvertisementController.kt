package cz.opendatalab.egidio.backend.presentation.controllers.advertisement

import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import org.springframework.http.ResponseEntity

interface AdvertisementController {
    //@PathVariable(name = "slug", required = true) slug: String
    fun getAdvertisementDetail(slug: String): ResponseEntity<*>

    fun createAdvertisement(advertisementCreateDto: AdvertisementCreateDto)

    fun publishAdvertisement(slug: String)

    fun cancelAdvertisement(slug: String, token: String?)

    fun getAdvertisementsPage(customFilteredPageRequest: CustomFilteredPageRequest<AdvertisementFilter>): ResponseEntity<*>
}