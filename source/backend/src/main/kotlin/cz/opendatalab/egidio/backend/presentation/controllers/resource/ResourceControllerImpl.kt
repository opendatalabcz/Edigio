package cz.opendatalab.egidio.backend.presentation.controllers.resource

import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import cz.opendatalab.egidio.backend.shared.converters.resource.ResourceConverter
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    name = "Resource",
    path = ["/resource"]
)
class ResourceControllerImpl(
    private val resourceService: ResourceService,
    private val resourceConverter: ResourceConverter
) : ResourceController {
    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        name = "findAllByName",
        path = ["/all"]
    )
    override fun getPage(
        @RequestBody customFilteredPageRequest: CustomFilteredPageRequest<ResourceFilter>
    ): CustomPage<ResourceShortDto> {
        return resourceService.getFilteredPage(customFilteredPageRequest)
            .map(resourceConverter::convertToShortDto)
    }

    @PostMapping(
        name = "create",
        path = [""]
    )
    override fun create(@RequestBody createDto: ResourceCreateDto) : ResponseEntity<String> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(resourceService.create(createDto).slug)
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        name = "getBySlug",
        path = ["/{slug}"]
    )
    override fun getBySlug(@PathVariable("slug") slug: String): ResourceDto {
        return resourceService.getBySlug(slug).let(resourceConverter::convertToDto)
    }
}