package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.EntityNotFoundException
import cz.opendatalab.egidio.backend.persistence.repositories.MultilingualTextRepository
import cz.opendatalab.egidio.backend.persistence.repositories.advertisement.AdvertisementRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.isAtLeastCoordinator
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import jakarta.transaction.Transactional
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.lang.IllegalArgumentException
import java.time.LocalDateTime

@Service
@Transactional
class AdvertisementServiceImpl(
    private val advertisementRepository: AdvertisementRepository,
    private val userService: UserService,
    private val authenticationService: AuthenticationService,
    private val multilingualTextRepository: MultilingualTextRepository
) : AdvertisementService {

    private fun advertisementAccessibleToCurrentUser(advertisement: Advertisement) : Boolean {
        //Only owner and coordinators and admins have access to the non-published advertisement
        return advertisement.status in setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
                || (SecurityContextHolder.getContext().authentication.principal as User?) == advertisement.createdBy
    }

    private fun updateFilterIfPossibleToBeAccessibleByUser(filter: AdvertisementFilter?) : AdvertisementFilter {
        val nonNullFilter: AdvertisementFilter = if(filter == null) AdvertisementFilter() else filter

        if(SecurityContextHolder.getContext().authentication.isAtLeastCoordinator) {
            //Coordinators and admins have access to all advertisements,
            // no need to update anything
            return nonNullFilter;
        }
        //Others have access only to published and resolved advertisements
        val accessibleStatuses = setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
        return nonNullFilter.copy(status = nonNullFilter.status?.filter { it in accessibleStatuses }?.toSet())
    }


    override fun getPage(pageRequest: CustomPageRequest, filter: AdvertisementFilter?): Page<Advertisement> {
        val updatedFilter = updateFilterIfPossibleToBeAccessibleByUser(filter)
        return advertisementRepository.findAllByFilter(
            filter = updatedFilter,
            pageable = PageRequest.of(pageRequest.idx, pageRequest.size)
        )
    }

    override fun getBySlug(slug: String): Advertisement {
        try {
            val advertisement = advertisementRepository.getBySlug(slug)
            if(!advertisementAccessibleToCurrentUser(advertisement)) {
                throw AccessDeniedException("Advertisement is not accessible to user!")
            }
            return advertisement
        } catch (ex: EmptyResultDataAccessException) {
            throw EntityNotFoundException(entityName = "Advertisement")
        }
    }

    private fun createAnonymousUser(anonymousUserInfoCreateDto: AnonymousUserInfoCreateDto) : User{
        return userService.createAnonymousUser(anonymousUserInfoCreateDto)
    }

    private fun resolveAdvertisementAuthor(anonymousUserInfoCreateDto: AnonymousUserInfoCreateDto?): User {
        val user: User;
        if(SecurityContextHolder.getContext().authentication.isAuthenticated) {
            user = authenticationService.currentLoggedInUser
        } else if(anonymousUserInfoCreateDto != null) {
            user = createAnonymousUser(anonymousUserInfoCreateDto)
        }  else {
            throw IllegalArgumentException("Anonymous user cannot create advertisement without sending data")
        }
        return user
    }
    override fun createAdvertisement(advertisement: AdvertisementCreateDto) {
        val author = resolveAdvertisementAuthor(advertisement.anonymousUserInfo)
        val title = multilingualTextRepository.save(MultilingualText(

        ))
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