package cz.opendatalab.egidio.backend.presentation.controllers.advertisement

import cz.opendatalab.egidio.backend.business.services.advertisement.AdvertisementService
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementDetailDto
import cz.opendatalab.egidio.backend.shared.converters.advertisement.AdvertisementConverter
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping(path = ["/advertisement"])
class AdvertisementControllerImpl @Autowired constructor(
    val advertisementService: AdvertisementService,
    val advertisementConverter : AdvertisementConverter
) : AdvertisementController {

    @GetMapping(
        name = GET_ADVERTISEMENT_DETAIL_MAPPING_NAME,
        path = ["/{slug}/detail"],
    )
    override fun getAdvertisementDetail(
        @PathVariable("slug", required = true) @NotBlank slug: String
    ): ResponseEntity<AdvertisementDetailDto> {
        return ResponseEntity.ok(
            this.advertisementService.getBySlug(slug).let(advertisementConverter::entityToDetailDto)
        )
    }

    @PostMapping(
        name = "getAdvertisementsPage",
        path = ["/filtered-page"]
    )
    override fun getAdvertisementsPage(
        @RequestBody @Valid customFilteredPageRequest: CustomFilteredPageRequest<AdvertisementFilter>
    ): ResponseEntity<*> {
        return ResponseEntity.ok(
            this.advertisementService.getPage(customFilteredPageRequest)
                .map(advertisementConverter::entityToShortDto)
        )
    }

    @PostMapping(
        name = "createAdvertisement",
        path = [""],
    )
    override fun createAdvertisement(
        @Valid() @RequestBody advertisementCreateDto : AdvertisementCreateDto
    ) : ResponseEntity<String> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(this.advertisementService.createAdvertisement(advertisementCreateDto).slug)
    }

    @PostMapping(path = ["/publish/{slug}/{token}"])
    override fun publishAdvertisement(@PathVariable("slug", required = true) @NotBlank slug: String) {
        this.advertisementService.publishAdvertisement(slug)
    }

    @PostMapping("/cancel/{slug}/{token}")
    override fun cancelAdvertisement(
        @PathVariable("slug", required = true) @NotBlank slug: String,
        @PathVariable("token", required = false) token: String?
    ) {
        this.advertisementService.cancelAdvertisement(slug, token)
    }

    companion object {
        const val GET_ADVERTISEMENT_DETAIL_MAPPING_NAME = "getAdvertisementDetail"
    }
}