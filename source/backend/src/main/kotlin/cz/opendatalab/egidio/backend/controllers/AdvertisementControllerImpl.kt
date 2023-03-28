package cz.opendatalab.egidio.backend.controllers

import cz.opendatalab.egidio.backend.business.services.AdvertisementService
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import jakarta.annotation.PostConstruct
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.query.Param
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
open class AdvertisementControllerImpl @Autowired constructor(
    val advertisementService: AdvertisementService
) {
    @GetMapping("/advertisement/:slug")
    open fun getAdvertisementDetail(@Param("slug") slug: String): ResponseEntity<*> {
        return ResponseEntity.ok(
            this.advertisementService.getBySlug("abc")
        )
    }

    @GetMapping("/advertisement")
    open fun getAdvertisement(
        @Valid @RequestParam() pageRequest: CustomPageRequest,
        @Valid filter: AdvertisementFilter?,
    ): ResponseEntity<*> {
        return ResponseEntity.ok(
            this.advertisementService.getPage(pageRequest, filter)
        )
    }

    fun createAdvertisement(
        @Valid() @RequestParam() advertisementCreateDto: AdvertisementCreateDto
    ) {
        this.advertisementService.createAdvertisement(advertisementCreateDto)
    }
}