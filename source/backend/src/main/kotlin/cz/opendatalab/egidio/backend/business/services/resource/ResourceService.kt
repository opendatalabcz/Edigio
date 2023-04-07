package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceCreateDto
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.annotation.security.PermitAll

interface ResourceService {
    @PermitAll
    fun getBySlug(slug: String): Resource
    @PermitAll
    fun getAllBySlugs(slugs: List<String>): List<Resource>
    @PermitAll
    fun getFilteredPage(filteredPageRequest: CustomFilteredPageRequest<ResourceFilter>): CustomPage<Resource>
    @PermitCoordinator
    fun create(resourceCreateDto: ResourceCreateDto) : Resource
}
