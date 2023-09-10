package cz.opendatalab.egidio.backend.business.services.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponseStatus.*
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponsePublishedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponsePublishedEventData
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEvent
import cz.opendatalab.egidio.backend.business.events.advertisement_response.AdvertisementResponseResolvedEventData
import cz.opendatalab.egidio.backend.business.exceptions.business.advertisement.AdvertisementActionNotAllowedForStatus
import cz.opendatalab.egidio.backend.business.exceptions.not_found.AdvertisementResponseNotFoundException
import cz.opendatalab.egidio.backend.business.exceptions.not_unique.ListedItemsResourcesNotUniqueException
import cz.opendatalab.egidio.backend.business.projections.project.AdvertisementResponsePreview
import cz.opendatalab.egidio.backend.business.services.advertisement.AdvertisementService
import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.data_access.repositories.AdvertisementResponseRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponseItemCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.NonRegisteredUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.ContactCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.shared.converters.advertisement_response.AdvertisementResponseConverter
import cz.opendatalab.egidio.backend.shared.tokens.facade.ExpiringTokenFacade
import cz.opendatalab.egidio.backend.shared.uuid.UuidProviderImpl
import jakarta.transaction.Transactional
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.OffsetDateTime
import java.util.*


@Service
@Transactional
class AdvertisementResponseServiceImpl(
    private val advertisementResponseRepository : AdvertisementResponseRepository,
    private val resourceService : ResourceService,
    private val advertisementService : AdvertisementService,
    private val randomUuidProviderImpl : UuidProviderImpl,
    private val expiringTokenFacade : ExpiringTokenFacade<String>,
    private val eventPublisher : ApplicationEventPublisher,
    private val authenticationService : AuthenticationService,
    private val userService : UserService,
    private val responseConverter : AdvertisementResponseConverter,
    private val clock : Clock
) : AdvertisementResponseService {
    fun currentUserOrTokenCanViewResponse(response : AdvertisementResponse, token : String?) : Boolean {
        //Check whether response is at least previewable by given token
        val previewTokenChecks = {
            expiringTokenFacade.nullableTokenAndValueChecks(
                token = response.previewToken,
                value = token
            )
        }
        //Check whether response is resolvable by given token
        val resolveTokenChecks = {
            expiringTokenFacade.nullableTokenAndValueChecks(
                token = response.resolveToken,
                value = token
            )
        }
        //When we are still waiting for responder to confirm given contact,
        // we don't want advertiser to be able to view the response (for his own safety)
        val accessibleToAdvertiser = response.responseStatus != WAITING_FOR_CONTACT_CONFIRMATION
        val userCanPreviewOrResolve = {
            authenticationService.currentLoggedInUser?.let {
                val userCanAccessAsAdvertiser = accessibleToAdvertiser && response.isUserAdvertiser(user = it)
                userCanAccessAsAdvertiser || response.isUserResponder(it) || it.isAtLeastCoordinator
            } == true
        }
        return previewTokenChecks() || resolveTokenChecks() || userCanPreviewOrResolve()
    }

    override fun getByPublicId(publicId : UUID, token : String?) : AdvertisementResponse {
        //Little optimization -> checking if token is null or whether user is authenticated is relatively fast
        // in comparison with response retrieval, that might not be even needed as without the condition being true
        // no response can be accessible to user
        if (token == null && !authenticationService.isUserAuthenticated) {
            throw AccessDeniedException("User cannot access the advertisement response!")
        }
        val response =
            advertisementResponseRepository.findByPublicId(publicId) ?: throw AdvertisementResponseNotFoundException()
        if (!currentUserOrTokenCanViewResponse(response, token)) {
            throw AccessDeniedException("Advertisement response not accessible to user!")
        }
        return response
    }

    fun canUserImmediatelyPublish(responder : User) = responder.emailConfirmed

    private fun contactCreateDtoToNonRegisteredUserCreateDto(contact : ContactCreateDto) : NonRegisteredUserInfoCreateDto {
        //Decided to put it inside this class instead of converter,
        // as this implementation is pretty specific for this use case
        return NonRegisteredUserInfoCreateDto(
            contact = contact,
            //Responder has no other choice than to publish complete contact.
            publishedContactDetail = PublishedContactDetailSettingsDto(
                firstname = true,
                lastname = true,
                email = true,
                telephoneNumber = true
            ),
            spokenLanguagesCodes = listOf()
        )
    }

    private fun publishResponse(response : AdvertisementResponse) {
        println("Publishing ${response}")
        val previewTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        val resolveTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        response.apply {
            previewToken = previewTokenWithRawValue.token
            resolveToken = resolveTokenWithRawValue.token
            responseStatus = WAITING_FOR_RESOLVE
        }
        this.eventPublisher.publishEvent(
            AdvertisementResponsePublishedEvent(
                AdvertisementResponsePublishedEventData(
                    responsePublicId = requireNotNull(response.publicId),
                    rawPreviewToken = previewTokenWithRawValue.rawValue,
                    rawResolveToken = resolveTokenWithRawValue.rawValue,
                    advertiserEmail = response.advertisement.createdBy.email,
                    responderEmail = response.createdBy.email,
                    advertisementSlug = response.advertisement.slug,
                    advertisementTitle = response.advertisement.title,
                )
            )
        )
    }

    override fun getPreviewByPublicIdAndWithOptionalToken(
        publicId : UUID,
        token : String?,
    ) : AdvertisementResponsePreview {
        return getByPublicId(publicId, token).let {
            this.responseConverter.entityToPreview(
                entity = it,
                resolvableByUser = !it.isResolved && authenticationService.currentLoggedInUser.let { user ->
                    user != null && (user.isAtLeastCoordinator || user.id == it.createdBy.id)
                },
                resolvableByToken = !it.isResolved && expiringTokenFacade.nullableTokenAndValueChecks(
                    it.resolveToken,
                    token
                ),
            )
        }

    }

    private fun createResponseItem(createDto : ResponseItemCreateDto, response : AdvertisementResponse) : ResponseItem =
        ResponseItem(
            resource = resourceService.getBySlug(slug = createDto.resourceSlug),
            description = createDto.description,
            amount = createDto.amount,
            response = response,
            publicId = randomUuidProviderImpl.getNext(),
            id = null
        )

    private fun createInitialResponse(
        createDto : AdvertisementResponseCreateDto,
        responder : User
    ) : AdvertisementResponse {
        val distinctResponseItemsResourcesCount = createDto.listedItems.distinctBy { it.resourceSlug }.size
        if(distinctResponseItemsResourcesCount != createDto.listedItems.size) {
            throw ListedItemsResourcesNotUniqueException()
        }
        return AdvertisementResponse(
            responderNote = createDto.note,
            advertiserNote = null,
            //Response items cannot be created without existing advertisementResponse,
            //therefore the list will be properly created later
            responseItems = mutableListOf(),
            advertisement = advertisementService.getBySlug(createDto.advertisementSlug),
            resolvedAt = null,
            createdAt = OffsetDateTime.now(clock),
            createdBy = responder,
            //By default, all new responses wait for contact confirmation.
            //If user can immediately publish the response, it's done bellow this initialization
            responseStatus = WAITING_FOR_CONTACT_CONFIRMATION,
            previewToken = null,
            resolveToken = null,
            publicId = randomUuidProviderImpl.getNext(),
            id = null
        ).apply {
            responseItems = createDto.listedItems
                .map { createResponseItem(it, this) }
                .toMutableList()
        }
    }

    override fun createResponse(createDto : AdvertisementResponseCreateDto) : AdvertisementResponse {
        val responder = authenticationService.currentLoggedInUser ?: userService.createNonRegisteredUser(
            contactCreateDtoToNonRegisteredUserCreateDto(createDto.contact)
        )
        val advertisement = advertisementService.getBySlug(createDto.advertisementSlug)
        if (advertisement.status !in setOf(AdvertisementStatus.PUBLISHED)) {
            throw AdvertisementActionNotAllowedForStatus("Response", advertisement.status)
        }
        val response = createInitialResponse(createDto, responder)
        if (canUserImmediatelyPublish(responder)) {
            publishResponse(response)
        }
        return advertisementResponseRepository.save(response)
    }


    fun userOrTokenCanResolveResponse(token : String?, response : AdvertisementResponse) : Boolean {
        val user = authenticationService.currentLoggedInUser
        val resolvableByLoggedUser =
            user != null && (user == response.advertisement.createdBy || user.isAtLeastCoordinator)
        val resolvableWithToken =
            response.resolveToken?.let { expiringTokenFacade.nullableValueChecks(it, token) } == true
        return resolvableByLoggedUser || resolvableWithToken
    }

    private fun resolveResponse(
        publicId : UUID,
        resolveDataDto : AdvertisementResponseResolveDataDto,
        finalStatus : AdvertisementResponseStatus
    ) {
        val response =
            advertisementResponseRepository.findByPublicId(publicId) ?: throw AdvertisementResponseNotFoundException()
        if (!userOrTokenCanResolveResponse(token = resolveDataDto.token, response = response)) {
            throw AccessDeniedException("Response cannot be resolved by user!")
        }
        val previewTokenWithRawValue = expiringTokenFacade.createWithRawValueIncluded(validityDuration = null)
        response.apply {
            resolveToken = null
            previewToken = previewTokenWithRawValue.token
            resolvedAt = OffsetDateTime.now(clock)
            advertiserNote = resolveDataDto.note
            responseStatus = finalStatus
        }
        this.eventPublisher.publishEvent(AdvertisementResponseResolvedEvent(
            AdvertisementResponseResolvedEventData(
                publicId = response.publicId,
                responsePreviewToken = previewTokenWithRawValue.rawValue,
                responderEmail = response.createdBy.email,
                advertisementTitle = response.advertisement.title,
                advertisementSlug = response.advertisement.slug,
                advertiserEmail = response.advertisement.createdBy.email,
                isAccepted = response.isAccepted
            )
        ))
    }

    override fun acceptResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto) {
        resolveResponse(publicId, resolveDataDto, ACCEPTED)
    }

    override fun rejectResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto) {
        resolveResponse(publicId, resolveDataDto, REJECTED)
    }

    override fun tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId : Long) {
        val user = this.userService.getUserById(userId)
        if (!user.emailConfirmed) {
            println("Email still not confirmed!")
            return
        }
        val responses = this.advertisementResponseRepository.findAllByResponseStatusAndCreatedById(
            responseStatus = WAITING_FOR_CONTACT_CONFIRMATION,
            id = userId
        )

        responses.forEach {
            this.publishResponse(it)
            this.advertisementResponseRepository.save(it)
        }
    }
}

