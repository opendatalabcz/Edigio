package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.resource.Resource

interface ResourceService {
    fun getBySlug(slug: String) : Resource
}
