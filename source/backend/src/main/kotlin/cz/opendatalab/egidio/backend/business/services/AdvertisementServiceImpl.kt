package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.EntityNotFoundException
import cz.opendatalab.egidio.backend.persistence.repositories.advertisement.AdvertisementRepository
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.isAtLeastCoordinator
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class AdvertisementServiceImpl(
    private val advertisementRepository: AdvertisementRepository,
) : AdvertisementService {

    private fun checkFilteredStatuses(statuses: Set<AdvertisementStatus>?) {
        val authentication = SecurityContextHolder.getContext().authentication
        val allAccessibleByUser = statuses == null || authentication.isAtLeastCoordinator || statuses.all {
            it in setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
        }
        if (!allAccessibleByUser) {
            throw AccessDeniedException("Cannot access one of required states!")
        }
    }

    override fun getPage(pageRequest: CustomPageRequest, filter: AdvertisementFilter): Page<Advertisement> {
        checkFilteredStatuses(statuses = filter.status)
        return advertisementRepository.findAllByFilter(
            filter = filter,
            pageable = PageRequest.of(pageRequest.idx, pageRequest.size)
        )
    }

    override fun getBySlug(slug: String): Advertisement {
        try {
            return advertisementRepository.getBySlug(slug)
        } catch (ex: EmptyResultDataAccessException) {
            throw EntityNotFoundException(entityName = "Advertisement")
        }
    }

    override fun createAdvertisement(advertisement: Advertisement) {
        TODO("Not yet implemented")
    }


    override fun publishAdvertisement(slug: String) {
        val advertisement = advertisementRepository.getBySlug(slug)
        if (!(advertisement.status in setOf(AdvertisementStatus.CREATED, AdvertisementStatus.EDITED))) {
            throw IllegalStateException("Cannot publish advertisement ${advertisement.slug}! Invalid state!")
        }
        advertisement.status = AdvertisementStatus.PUBLISHED
        advertisement.lastApprovedAt = LocalDateTime.now()
        advertisement.lastApprovedBy = SecurityContextHolder.getContext().authentication.details as User
        advertisementRepository.save(advertisement)
    }

    override fun cancelAdvertisement(slug: String) {
        TODO("Not yet implemented")
    }

    override fun resolveAdvertisement(slug: String) {
        TODO("Not yet implemented")
    }
}