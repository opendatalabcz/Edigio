package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.persistence.repositories.ResourceRepository
import cz.opendatalab.egidio.backend.shared.converters.page.PageConverter
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.stereotype.Service

@Service
class ResourceServiceImpl(
    private val resourceRepository: ResourceRepository,
    private val pageConverter: PageConverter
) : ResourceService {
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