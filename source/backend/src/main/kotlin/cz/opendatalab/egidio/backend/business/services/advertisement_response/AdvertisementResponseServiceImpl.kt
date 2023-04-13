package cz.opendatalab.egidio.backend.business.services.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseStatus.*
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.events.user.AdvertisementResponsePublishedEvent
import cz.opendatalab.egidio.backend.business.events.user.AdvertisementResponsePublishedEventData
import cz.opendatalab.egidio.backend.business.exceptions.not_found.AdvertisementResponseNotFoundException
import cz.opendatalab.egidio.backend.business.services.advertisement.AdvertisementService
import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.persistence.repositories.AdvertisementResponseRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseResolveDataDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponseItemCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.ContactCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.shared.tokens.facade.ExpiringTokenFacade
import cz.opendatalab.egidio.backend.shared.uuid.UuidProviderImpl
import jakarta.transaction.Transactional
import org.springframework.context.ApplicationEventPublisher
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime
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
    private val clock : Clock
) : AdvertisementResponseService {
    fun currentUserOrTokenCanViewResponse(response : AdvertisementResponse, token : String?) : Boolean {
        val previewTokenChecks = {
            expiringTokenFacade.nullableTokenAndValueChecks(
                token = response.previewToken,
                value = token
            )
        }
        val resolveTokenChecks = {
            expiringTokenFacade.nullableTokenAndValueChecks(
                token = response.resolveToken,
                value = token
            )
        }
        val accessibleToAdvertiser = response.responseStatus != WAITING_FOR_CONTACT_CONFIRMATION
        val userCanPreviewOrResolve = {
            authenticationService.currentLoggedInUser?.let {
                val userCanAccessAsAdvertiser = accessibleToAdvertiser && response.isUserAdvertiser(user = it)
                it == response.createdBy || it.isAtLeastCoordinator || userCanAccessAsAdvertiser
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

    private fun contactCreateDtoToAnonymousUserCreateDto(contact : ContactCreateDto) : AnonymousUserInfoCreateDto {
        //Decided to put it inside this class instead of converter,
        // as this implementation is pretty specific for this use case
        return AnonymousUserInfoCreateDto(
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
        this.eventPublisher.publishEvent( AdvertisementResponsePublishedEvent (
            AdvertisementResponsePublishedEventData(
                responsePublicId = requireNotNull(response.publicId),
                rawPreviewToken = previewTokenWithRawValue.rawValue,
                rawResolveToken = resolveTokenWithRawValue.rawValue,
                advertiserEmail = response.advertisement.createdBy.email,
                responderEmail = response.createdBy.email,
                advertisementSlug = response.advertisement.slug,
                advertisementTitle = response.advertisement.title,
            )
        ))
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
        return AdvertisementResponse(
            responderNote = createDto.note,
            advertiserNote = null,
            //Response items cannot be created without existing advertisementResponse,
            //therefore the list will be properly created later
            responseItems = mutableListOf(),
            advertisement = advertisementService.getBySlug(createDto.advertisementSlug),
            resolvedAt = null,
            createdAt = LocalDateTime.now(clock),
            createdBy = responder,
            //By default, all new responses wait for contact confirmation
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
        val responder = authenticationService.currentLoggedInUser ?: userService.createAnonymousUser(
            contactCreateDtoToAnonymousUserCreateDto(createDto.contact)
        )
        val advertisement = advertisementService.getBySlug(createDto.advertisementSlug)
        if (advertisement.status !in setOf(AdvertisementStatus.PUBLISHED)) {
            throw IllegalStateException("Cannot create response for advertisement that's not published!")
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

    override fun acceptResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto) {
        val response =
            advertisementResponseRepository.findByPublicId(publicId) ?: throw AdvertisementResponseNotFoundException()
        if (!userOrTokenCanResolveResponse(token = resolveDataDto.token, response = response)) {
            throw AccessDeniedException("Response cannot be resolved by user!")
        }
        response.apply {
            resolveToken = null
            resolvedAt = LocalDateTime.now(clock)
            advertiserNote = resolveDataDto.note
            responseStatus = ACCEPTED
        }
        //TODO: Notify responder about response being accepted
        //TODO: Notify advertiser about response being successfully accepted
    }

    override fun rejectResponse(publicId : UUID, resolveDataDto : AdvertisementResponseResolveDataDto) {
        val response = getByPublicId(publicId, resolveDataDto.token)
        if (!userOrTokenCanResolveResponse(token = resolveDataDto.token, response = response)) {
            throw AccessDeniedException("Response cannot be resolved by user!")
        }
        response.apply {
            resolveToken = null
            resolvedAt = LocalDateTime.now(clock)
            advertiserNote = resolveDataDto.note
            responseStatus = REJECTED
        }
        //TODO: Notify responder about response being rejected
        //TODO: Notify advertiser about response being successfully rejected
    }

    override fun tryPublishAllWaitingResponsesRelatedToUserWithIdInternal(userId : Long) {
        val user = this.userService.getUserById(userId)
        if (!user.emailConfirmed) {
            println("Email still not confirmed!")
            return
        }
        val advertisements = this.advertisementResponseRepository.findAllByResponseStatusAndCreatedById(
            responseStatus = WAITING_FOR_CONTACT_CONFIRMATION,
            id = userId
        )

        advertisements.forEach {
            this.publishResponse(it)
            this.advertisementResponseRepository.save(it)
        }
    }
}

