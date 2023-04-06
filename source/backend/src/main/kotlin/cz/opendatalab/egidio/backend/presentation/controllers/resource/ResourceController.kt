package cz.opendatalab.egidio.backend.presentation.controllers.resource

import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto
import cz.opendatalab.egidio.backend.shared.filters.ResourceFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage

interface ResourceController {
    fun getBySlug(slug: String): ResourceDto
    fun getPage(customFilteredPageRequest: CustomFilteredPageRequest<ResourceFilter>): CustomPage<ResourceShortDto>
}