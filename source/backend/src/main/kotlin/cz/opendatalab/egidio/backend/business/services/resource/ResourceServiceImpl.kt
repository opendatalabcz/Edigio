package cz.opendatalab.egidio.backend.business.services.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.persistence.repositories.ResourceRepository
import cz.opendatalab.egidio.backend.shared.filters.MultilingualTextFilter
import org.springframework.stereotype.Service

@Service
class ResourceServiceImpl(private val resourceRepository: ResourceRepository) : ResourceService {
    override fun getBySlug(slug: String): Resource {
        return resourceRepository.getBySlug(slug)
    }

    override fun findAllByName(nameFilter: MultilingualTextFilter) {
        return resourceRepository.findAllByNameLike(nameFilter)
    }
}