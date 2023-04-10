package cz.opendatalab.egidio.backend.business.services.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementStatus
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseStatus
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.AdvertisementResponseNotFoundException
import cz.opendatalab.egidio.backend.business.services.advertisement.AdvertisementService
import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.business.services.user.UserService
import cz.opendatalab.egidio.backend.persistence.repositories.AdvertisementResponseRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponseCreateDto
import cz.opendatalab.egidio.backend.shared.tokens.checker.ExpiringTokenChecker
import cz.opendatalab.egidio.backend.shared.tokens.factory.ExpiringTokenFactory
import cz.opendatalab.egidio.backend.shared.uuid.UuidProviderImpl
import jakarta.transaction.Transactional
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime
import java.util.*


@Service
@Transactional
class AdvertisementResponseServiceImpl(
    private val advertisementResponseRepository: AdvertisementResponseRepository,
    private val resourceService: ResourceService,
    private val advertisementService: AdvertisementService,
    private val randomUuidProviderImpl: UuidProviderImpl,
    private val expiringTokenFactory: ExpiringTokenFactory<String>,
    private val authenticationService: AuthenticationService,
    private val tokenChecker: ExpiringTokenChecker<String>,
    private val userService: UserService,
    private val clock: Clock
) : AdvertisementResponseService {
    fun currentUserOrTokenCanViewResponse(response: AdvertisementResponse, token: String?): Boolean {
        val previewTokenChecks = {
            tokenChecker.nullableTokenAndValueChecks(
                token = response.previewToken,
                value = token
            )
        }
        val resolveTokenChecks = {
            tokenChecker.nullableTokenAndValueChecks(
                token = response.resolveToken,
                value = token
            )
        }
        val accessibleToAdvertiser = response.responseStatus != ResponseStatus.WAITING_FOR_CONTACT_CONFIRMATION
        val userCanPreviewOrResolve = {
            authenticationService.currentLoggedInUser?.let {
                val userCanAccessAsAdvertiser = accessibleToAdvertiser && response.isUserAdvertiser(user = it)
                it == response.createdBy || it.isAtLeastCoordinator || userCanAccessAsAdvertiser
            } == true
        }
        return previewTokenChecks() || resolveTokenChecks() || userCanPreviewOrResolve()
    }

    override fun getByPublicId(publicId: UUID, token: String?): AdvertisementResponse {
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

    fun afterCreationStatusForResponder(responder: User) = when (responder.emailConfirmed) {
        true -> ResponseStatus.WAITING_FOR_RESOLVE
        false -> ResponseStatus.WAITING_FOR_CONTACT_CONFIRMATION
    }

    override fun createResponse(createDto: AdvertisementResponseCreateDto): AdvertisementResponse {
        //Because ResponseItem requires response to be not null,
        // we first pass empty list of items. The list is filled additionally after the response is initalized,
        // just before it's stored.
        val items = mutableListOf<ResponseItem>()
        val responder = authenticationService.currentLoggedInUser ?: userService.createAnonymousUser(
            createDto.anonymousUserInfoCreateDto
        )
        val advertisement = advertisementService.getBySlug(createDto.advertisementSlug)
        if(advertisement.status !in setOf(AdvertisementStatus.PUBLISHED)) {
            throw IllegalStateException("Cannot create response for advertisement that's not published!")
        }
        val response = AdvertisementResponse(
            responderNote = createDto.note,
            advertiserNote = null,
            responseItems = items,
            advertisement = advertisementService.getBySlug(createDto.advertisementSlug),
            resolvedAt = null,
            createdAt = LocalDateTime.now(clock),
            createdBy = responder,
            responseStatus = afterCreationStatusForResponder(responder),
            previewToken = expiringTokenFactory.create(null) { println("Preview token: ${it}") },
            resolveToken = expiringTokenFactory.create(null) { println("Resolve token: ${it}") },
            publicId = randomUuidProviderImpl.getNext(),
            id = null
        )
        createDto.listedItems.mapTo(items) {
            ResponseItem(
                resource = resourceService.getBySlug(slug = it.resourceSlug),
                description = it.description,
                amount = it.amount,
                response = response,
                publicId = randomUuidProviderImpl.getNext(),
                id = null
            )
        }
        return advertisementResponseRepository.save(response)
    }


    fun userOrTokenCanResolveResponse(token: String?, response: AdvertisementResponse): Boolean {
        val user = authenticationService.currentLoggedInUser
        val resolvableByLoggedUser =
            user != null && (user == response.advertisement.createdBy || user.isAtLeastCoordinator)
        val resolvableWithToken = response.resolveToken?.let { tokenChecker.nullableValueChecks(it, token) } == true
        return resolvableByLoggedUser || resolvableWithToken
    }

    override fun acceptResponse(publicId: UUID, token: String?, note: String?) {
        val response =
            advertisementResponseRepository.findByPublicId(publicId) ?: throw AdvertisementResponseNotFoundException()
        if (!userOrTokenCanResolveResponse(token = token, response = response)) {
            throw AccessDeniedException("Response cannot be resolved by user!")
        }
        response.apply {
            resolveToken = null
            resolvedAt = LocalDateTime.now(clock)
            advertiserNote = note
            responseStatus = ResponseStatus.ACCEPTED
        }
        //TODO: Notify responder about response being accepted
        //TODO: Notify advertiser about response being successfully accepted
    }

    override fun rejectResponse(publicId: UUID, token: String?, note: String?) {
        val response = getByPublicId(publicId, token)
        if (!userOrTokenCanResolveResponse(token = token, response = response)) {
            throw AccessDeniedException("Response cannot be resolved by user!")
        }
        response.apply {
            resolveToken = null
            resolvedAt = LocalDateTime.now(clock)
            advertiserNote = note
            responseStatus = ResponseStatus.REJECTED
        }
        //TODO: Notify responder about response being rejected
        //TODO: Notify advertiser about response being successfully rejected
    }
}

