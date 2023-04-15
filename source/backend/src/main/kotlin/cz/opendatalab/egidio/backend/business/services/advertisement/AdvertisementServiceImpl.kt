package cz.opendatalab.egidio.backend.business.services.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus
import cz.opendatalab.egidio.backend.business.entities.location.Location
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementCreatedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementCreatedEventData
import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementPublishedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement.AdvertisementPublishedEventData
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEventData
import cz.opendatalab.egidio.backend.business.exceptions.not_found.AdvertisementNotFoundException
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
import cz.opendatalab.egidio.backend.shared.converters.page.PageConverter
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import cz.opendatalab.egidio.backend.shared.tokens.facade.ExpiringTokenFacade
import jakarta.transaction.Transactional
import org.springframework.context.ApplicationEventPublisher
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime

@Service
@Transactional
class AdvertisementServiceImpl(
    private val advertisementRepository : AdvertisementRepository,
    private val userService : UserService,
    private val authenticationService : AuthenticationService,
    private val multilingualTextService : MultilingualTextService,
    private val projectService : ProjectService,
    private val resourceService : ResourceService,
    private val slugUtility : SlugUtility,
    private val expiringTokenFacade: ExpiringTokenFacade<String>,
    private val eventPublisher : ApplicationEventPublisher,
    private val pageConverter : PageConverter,
    private val clock : Clock,
) : AdvertisementService {


    private fun advertisementAccessibleToCurrentUser(advertisement : Advertisement) : Boolean {
        //Only owner and coordinators and admins have access to the non-published advertisement
        return advertisement.status in setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
                || authenticationService.currentLoggedInUser == advertisement.createdBy
    }

    private fun updateFilterIfPossibleToBeAccessibleByUser(filter : AdvertisementFilter?) : AdvertisementFilter {
        val nonNullFilter : AdvertisementFilter = if (filter == null) AdvertisementFilter() else filter

        if (authenticationService.isAtLeastCoordinatorLoggedIn) {
            //Coordinators and admins have access to all advertisements,
            // no need to update anything
            return nonNullFilter
        }
        //Others have access only to published and resolved advertisements
        val accessibleStatuses = setOf(AdvertisementStatus.PUBLISHED, AdvertisementStatus.RESOLVED)
        return nonNullFilter.copy(
            status = nonNullFilter.status?.filter { it in accessibleStatuses }?.toSet(),
            //Only coordinators and administrators can access advertisements that are not confirmed yet
            withConfirmedContactOnly = true
        )
    }


    override fun getPage(filteredPageRequest : CustomFilteredPageRequest<AdvertisementFilter>) : CustomPage<Advertisement> {
        return advertisementRepository.findAllByFilter(
            filter = updateFilterIfPossibleToBeAccessibleByUser(filteredPageRequest.filter),
            pageable = pageConverter.customPageRequestToPageRequest(filteredPageRequest.pageRequest)
        ).let(pageConverter::pageToCustomPage)
    }

    override fun getBySlug(slug : String) : Advertisement {
        try {
            val advertisement = advertisementRepository.findBySlug(slug) ?: throw AdvertisementNotFoundException()
            if (!advertisementAccessibleToCurrentUser(advertisement)) {
                throw AccessDeniedException("Advertisement is not accessible to user!")
            }
            return advertisement
        } catch (ex : EmptyResultDataAccessException) {
            throw AdvertisementNotFoundException()
        }
    }

    private fun createAnonymousUser(anonymousUserInfoCreateDto : AnonymousUserInfoCreateDto) : User {
        return userService.createAnonymousUser(anonymousUserInfoCreateDto)
    }

    private fun resolveAdvertisementAuthor(anonymousUserInfoCreateDto : AnonymousUserInfoCreateDto?) : User {
        val user : User = if (authenticationService.isUserAuthenticated) {
            authenticationService.requireLoggedInUser()
        } else if (anonymousUserInfoCreateDto != null) {
            createAnonymousUser(anonymousUserInfoCreateDto)
        } else {
            throw IllegalArgumentException("Anonymous user cannot create advertisement without sending contact")
        }
        return user
    }

    private fun createAdvertisementItemInstance(
        item : AdvertisementItemCreateDto,
        advertisement : Advertisement
    ) : AdvertisementItem {
        return AdvertisementItem(
            resource = resourceService.getBySlug(item.resourceSlug),
            description = item.description?.let { multilingualTextService.create(it) },
            amount = item.amount,
            advertisement = advertisement
        )
    }

    private fun createLocation(locationCreateDto : AdvertisementLocationCreateDto) : Location {
        return locationCreateDto.let {
            Location(
                country = it.country,
                region = it.region,
                city = it.city,
                street = it.street,
                houseNumber = it.houseNumber,
                postalCode = it.postalCode
            )
        }
    }

    override fun createAdvertisement(advertisementCreateDto : AdvertisementCreateDto) : Advertisement {
        val resolveToken = expiringTokenFacade.createWithRawValueIncluded()
        val cancelToken = expiringTokenFacade.createWithRawValueIncluded()
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
            projects = mutableListOf(projectService.getBySlug(advertisementCreateDto.projectSlug)),
            slug = slugUtility.createSlugWithLocalDateTimePrepended(
                LocalDateTime.now(clock),
                advertisementCreateDto.title.firstNonBlankText().text
            ),
            cancelingToken = cancelToken.token,
            resolveToken = resolveToken.token
        )
        advertisementCreateDto.items.mapTo(advertisement.advertisementItems) {
            createAdvertisementItemInstance(it, advertisement)
        }
        eventPublisher.publishEvent(
            AdvertisementCreatedEvent(
            AdvertisementCreatedEventData(
                rawCancelToken = cancelToken.rawValue,
                rawResolveToken = resolveToken.rawValue,
                advertiserEmail = advertisement.createdBy.email,
                advertisementSlug = advertisement.slug,
                advertisementTitle = advertisement.title
            )
        )
        )
        return advertisementRepository.save(advertisement)
    }

    override fun publishAdvertisement(slug : String) {
        val advertisement = advertisementRepository.findBySlug(slug) ?: throw AdvertisementNotFoundException()
        if (advertisement.status !in setOf(AdvertisementStatus.CREATED, AdvertisementStatus.EDITED)) {
            throw IllegalStateException("Cannot publish advertisement ${advertisement.slug}! Invalid state!")
        } else if (!advertisement.createdBy.emailConfirmed) {
            throw IllegalStateException("Cannot publish advertisement of user whose email wasn't confirmed yet!")
        }
        advertisementRepository.save(advertisement.apply {
            status = AdvertisementStatus.PUBLISHED
            lastApprovedAt = LocalDateTime.now(clock)
            lastApprovedBy = authenticationService.currentLoggedInUser
        })
        eventPublisher.publishEvent(AdvertisementPublishedEvent(
            data = AdvertisementPublishedEventData.of(advertisement)
        ))
    }

    private fun userCanCancelAdvertisement(advertisement : Advertisement, token : String?) : Boolean {
        val cancelingToken = advertisement.cancelingToken
        val tokenIsCancelingToken =
            token?.let { cancelingToken != null && expiringTokenFacade.checks(cancelingToken, it) } == true
        return tokenIsCancelingToken || authenticationService.currentLoggedInUser.let {
            it != null && (it.isAtLeastCoordinator || advertisement.isOwnedByUser(it))
        }
    }

    private fun rejectNotResolvedAdvertisementResponses(advertisement : Advertisement) {
        val previewTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        advertisement.responses.forEach {
            if (!it.isResolved) {
                it.resolvedAt = LocalDateTime.now(clock)
                it.responseStatus = AdvertisementResponseStatus.REJECTED_ON_ADVERTISEMENT_RESOLVE
                it.resolveToken = null
                this.eventPublisher.publishEvent(AdvertisementResponseResolvedEvent(
                    AdvertisementResponseResolvedEventData(
                        publicId = it.publicId,
                        responsePreviewToken = previewTokenWithRawValue.rawValue,
                        responderEmail = it.createdBy.email,
                        advertisementTitle = it.advertisement.title,
                        advertisementSlug = it.advertisement.slug,
                        advertiserEmail = advertisement.createdBy.email,
                        isAccepted = false
                    )
                ))
            }
        }
    }

    override fun cancelAdvertisement(slug : String, token : String?) {
        val advertisement = advertisementRepository.findBySlug(slug) ?: throw AdvertisementNotFoundException()
        if (!userCanCancelAdvertisement(advertisement, token)) {
            throw AccessDeniedException("User cannot cancel advertisement with given slug!")
        }
        //Make sure that transition from current status to CANCELED is valid
        // By current logic, invalid transitions  CANCELED => CANCELED and RESOLVED => CANCELED
        if (advertisement.status !in setOf(
                AdvertisementStatus.CREATED,
                AdvertisementStatus.EDITED,
                AdvertisementStatus.PUBLISHED,
            )
        ) {
            throw IllegalStateException("Cannot cancel advertisement ${advertisement.slug}! Invalid state ${advertisement.status}!")
        }
        //When advertisement is canceled, there cannot remain any unresolved responses.
        // It's assumed that user also wants to reject these responses
        rejectNotResolvedAdvertisementResponses(advertisement)
        advertisement.apply {
            status = AdvertisementStatus.CANCELED
            cancelingToken = null
            resolveToken = null
            canceledAt = LocalDateTime.now(clock)
            canceledBy = authenticationService.currentLoggedInUser ?: advertisement.createdBy
        }
    }

    private fun advertisementResolvableByLoggedInUser(advertisement : Advertisement) : Boolean {
        return authenticationService.currentLoggedInUser.let {
            it != null && (it.isAtLeastCoordinator || advertisement.isOwnedByUser(it))
        }
    }

    override fun resolveAdvertisement(slug : String, token : String?) {
        val advertisement : Advertisement
        try {
            advertisement = advertisementRepository.findBySlug(slug) ?: throw AdvertisementNotFoundException()
        } catch (ex : EmptyResultDataAccessException) {
            throw AdvertisementNotFoundException()
        }
        if (advertisement.status != AdvertisementStatus.PUBLISHED) {
            throw IllegalStateException("Cannot resolve advertisement that's not published!")
        }
        if (token != null && advertisement.resolveToken?.let { expiringTokenFacade.checks(it, token) } == true) {
            //When user is logged in, and has access token, then we should mark him as the resolved
            // otherwise user owning the advertisement should be considered as resolver
            advertisement.resolvedBy = authenticationService.currentLoggedInUser ?: advertisement.createdBy
        } else if (token == null && advertisementResolvableByLoggedInUser(advertisement)) {
            advertisement.resolvedBy = authenticationService.requireLoggedInUser()
        } else {
            throw AccessDeniedException("Access to the advertisement forbidden!")
        }
        advertisement.resolvedAt = LocalDateTime.now(clock)
        advertisement.cancelingToken = null
        advertisement.resolveToken = null
        advertisement.status = AdvertisementStatus.RESOLVED
        rejectNotResolvedAdvertisementResponses(advertisement)
    }
}