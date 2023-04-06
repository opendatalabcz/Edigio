package cz.opendatalab.egidio.backend.presentation.controllers.resource

import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import cz.opendatalab.egidio.backend.shared.converters.resource.ResourceConverter
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.http.HttpStatus
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

    @ResponseStatus(HttpStatus.OK)
    @GetMapping
    override fun getBySlug(slug: String): ResourceDto {
        return resourceService.getBySlug(slug).let(resourceConverter::convertToDto)
    }
}