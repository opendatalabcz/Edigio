package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage

interface ResourceService {
    fun getBySlug(slug: String): Resource
    fun getFilteredPage(filteredPageRequest: CustomFilteredPageRequest<ResourceFilter>): CustomPage<Resource>
}
