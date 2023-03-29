package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.shared.filters.MultilingualTextFilter

interface ResourceService {
    fun getBySlug(slug: String) : Resource
    fun findAllByName(nameFilter: MultilingualTextFilter)
}
