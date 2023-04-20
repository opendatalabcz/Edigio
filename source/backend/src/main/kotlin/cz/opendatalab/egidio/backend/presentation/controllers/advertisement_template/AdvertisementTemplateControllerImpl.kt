package cz.opendatalab.egidio.backend.presentation.controllers.advertisement_template

import cz.opendatalab.egidio.backend.business.services.advertisement_template.AdvertisementTemplateService
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplatePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateShortDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import cz.opendatalab.egidio.backend.shared.converters.advertisement_template.AdvertisementTemplateConverter
import cz.opendatalab.egidio.backend.shared.converters.resource.ResourceConverter
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementTemplateFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RequestMapping(
    name = "AdvertisementTemplate",
    path = ["/advertisement-template"]
)
@RestController
class AdvertisementTemplateControllerImpl(
    val advertisementTemplateService: AdvertisementTemplateService,
    val advertisementTemplateConverter: AdvertisementTemplateConverter,
    val resourceConverter : ResourceConverter
) : AdvertisementTemplateController {
    @PostMapping(
        name = "create",
        path = [""]
    )
    override fun create(@RequestBody createDto: AdvertisementTemplateCreateDto): ResponseEntity<String> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(advertisementTemplateService.create(createDto).slug)
    }

    @PostMapping(
        name = "getPageByFilter",
        path = ["/page"]
    )
    override fun getPageByFilter(
        @RequestBody filteredPageRequest: CustomFilteredPageRequest<AdvertisementTemplateFilter>
    ): ResponseEntity<CustomPage<AdvertisementTemplateShortDto>> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(
                advertisementTemplateService.getPageByFilter(filteredPageRequest)
                    .map ( advertisementTemplateConverter::entityToShortDto )
            )
    }

    @GetMapping(
        name = "getPreview",
        path = ["/{slug}/preview"]
    )
    override fun getPreview(@PathVariable(name = "slug") slug: String): ResponseEntity<AdvertisementTemplatePreviewDto> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(advertisementTemplateService.getBySlug(slug).let(advertisementTemplateConverter::entityToPreviewDto))
    }

    @GetMapping(
        name = "getRecommendedResource",
        path = ["/{slug}/recommended-resources"]
    )
    fun getRecommendedResource(@PathVariable slug : String) : ResponseEntity<List<ResourceShortDto>>{
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(
                this.advertisementTemplateService.getRecommendedResources(slug)
                    .map ( resourceConverter::convertToShortDto )
            )
    }
}