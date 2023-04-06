package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.persistence.repositories.ResourceRepository
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceCreateDto
import cz.opendatalab.egidio.backend.shared.converters.page.PageConverter
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime

@Service
class ResourceServiceImpl(
    private val resourceRepository: ResourceRepository,
    private val multilingualTextService: MultilingualTextService,
    private val pageConverter: PageConverter,
    private val slugUtility: SlugUtility,
    private val clock: Clock
) : ResourceService {
    override fun create(resourceCreateDto: ResourceCreateDto): Resource {
        return resourceRepository.save( Resource(
                name = multilingualTextService.create(resourceCreateDto.name),
                description = multilingualTextService.create(resourceCreateDto.description),
                slug = slugUtility.createSlugWithLocalDateTimePrepended(
                    localDateTime = LocalDateTime.now(clock),
                    resourceCreateDto.name.firstNonBlankText().text
                )
            )
        )
    }

    override fun getBySlug(slug: String): Resource {
        return resourceRepository.getBySlug(slug)
    }

    override fun getFilteredPage(filteredPageRequest: CustomFilteredPageRequest<ResourceFilter>): CustomPage<Resource> {
        return resourceRepository.getPageByFilter(
            filteredPageRequest.filter ?: ResourceFilter.of(),
            filteredPageRequest.pageRequest.let(pageConverter::customPageRequestToPageRequest)
        ).let(pageConverter::pageToCustomPage)
    }
}