package cz.opendatalab.egidio.backend.business.services.advertisement

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.location.Location
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.user.AdvertisementNotFoundException
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.business.services.project.ProjectService
import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.persistence.repositories.advertisement.AdvertisementRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementItemCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementLocationCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import cz.opendatalab.egidio.backend.shared.tokens.UuidExpiringTokenFactory
import jakarta.transaction.Transactional
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.lang.IllegalArgumentException
import java.time.Clock
import java.time.LocalDateTime
import java.util.UUID

@Service
@Transactional
class AdvertisementServiceImpl(
    private val advertisementRepository: AdvertisementRepository,
    private val userService: UserService,
    private val authenticationService: AuthenticationService,
    private val multilingualTextService: MultilingualTextService,
    private val projectService: ProjectService,
    private val resourceService: ResourceService,
    private val slugUtility: SlugUtility,
    private val expiringTokenFactory: UuidExpiringTokenFactory,
    private val clock: Clock,
) : AdvertisementService {

    private fun advertisementAccessibleToCurrentUser(advertisement: Advertisement) : Boolean {
        //Only owner and coordinators and admins have access to the non-published advertisement
        return advertisement.status in setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
                || authenticationService.currentLoggedInUser == advertisement.createdBy
    }

    private fun updateFilterIfPossibleToBeAccessibleByUser(filter: AdvertisementFilter?) : AdvertisementFilter {
        val nonNullFilter: AdvertisementFilter = if(filter == null) AdvertisementFilter() else filter

        if(authenticationService.currentLoggedInUser.isAtLeastCoordinator) {
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
            throw AdvertisementNotFoundException()
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
            throw IllegalArgumentException("Anonymous user cannot create advertisement without sending contact")
        }
        return user
    }

    private fun createAdvertisementItem(item: AdvertisementItemCreateDto, advertisement: Advertisement) : AdvertisementItem {
        return AdvertisementItem(
            resource = resourceService.getBySlug(item.resourceSlug),
            description = item.description?.let { multilingualTextService.create(it) },
            amount = item.amount,
            advertisement = advertisement
        )
    }

    private fun createLocation(locationCreateDto: AdvertisementLocationCreateDto) : Location {
        return locationCreateDto.let { Location(
            country = it.country,
            region = it.region,
            city = it.city,
            street = it.street,
            houseNumber = it.houseNumber,
            postalCode = it.postalCode
         )}
    }

    override fun createAdvertisement(advertisementCreateDto: AdvertisementCreateDto) : Advertisement {
        val project = projectService.getBySlug(advertisementCreateDto.projectId)
        val advertisement = Advertisement(
            title = multilingualTextService.create(advertisementCreateDto.title),
            description = advertisementCreateDto.description?.let { multilingualTextService.create(it) },
            //Items require advertisement as to be not null, therefore we first must create empty advertisement
            // and set items later
            advertisementItems = mutableListOf(),
            type = advertisementCreateDto.type,
            helpType = advertisementCreateDto.helpType,
            //No responses in the beginning
            responses = mutableListOf(),
            location = createLocation(advertisementCreateDto.location),
            status = AdvertisementStatus.CREATED,
            createdAt = LocalDateTime.now(),
            createdBy = resolveAdvertisementAuthor(advertisementCreateDto.anonymousUserInfo),
            projects = mutableListOf(project),
            slug = slugUtility.createSlug(
                slugUtility.createLocalDateTimeSlug(LocalDateTime.now(clock)),
                advertisementCreateDto.title.firstNonBlankText().text
            ),
            cancelingToken = expiringTokenFactory.create(),
            resolveToken = expiringTokenFactory.create()
        )
        return advertisementRepository.save(advertisement.apply {
            //Setup advertisements items before saving
            advertisementItems = advertisementCreateDto.items
                .map{ createAdvertisementItem(it, advertisement) }
                .toMutableList()
        })
    }

    private fun userCanPublishAdvertisement() : Boolean {
        return authenticationService.currentLoggedInUser.isAtLeastCoordinator
    }

    @PermitCoordinator
    override fun publishAdvertisement(slug: String) {
        val advertisement = advertisementRepository.getBySlug(slug)
        if (advertisement.status !in setOf(AdvertisementStatus.CREATED, AdvertisementStatus.EDITED)) {
            throw IllegalStateException("Cannot publish advertisement ${advertisement.slug}! Invalid state!")
        }
        advertisementRepository.save(advertisement.apply {
            status = AdvertisementStatus.PUBLISHED
            lastApprovedAt = LocalDateTime.now(clock)
            lastApprovedBy = authenticationService.currentLoggedInUser
        })
    }

    private fun userCanCancelAdvertisement(advertisement: Advertisement, token: UUID?) : Boolean{
        val cancelingToken = advertisement.cancelingToken?.token
        val tokenIsCancelingToken = token != null && cancelingToken != null && cancelingToken == token
        return tokenIsCancelingToken
                || advertisement.createdBy == authenticationService.currentLoggedInUser
                || authenticationService.currentLoggedInUser.isAtLeastCoordinator
    }

    override fun cancelAdvertisement(slug: String, token: UUID?) {
        val advertisement = advertisementRepository.getBySlug(slug)
        if(!userCanCancelAdvertisement(advertisement, token)) {
            throw AccessDeniedException("User cannot cancel advertisement with given slug!")
        }
        if (advertisement.status !in setOf(AdvertisementStatus.CREATED, AdvertisementStatus.EDITED, AdvertisementStatus.PUBLISHED)) {
            throw IllegalStateException("Cannot cancel advertisement ${advertisement.slug}! Invalid state ${advertisement.status}!")
        }
        advertisementRepository.save(advertisement.apply {
            status = AdvertisementStatus.PUBLISHED
            lastApprovedAt = LocalDateTime.now(clock)
            lastApprovedBy = authenticationService.currentLoggedInUser
        })
    }

    override fun resolveAdvertisement(slug: String, token: String?) {
        TODO("Not yet implemented")
    }
}