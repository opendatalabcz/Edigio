package cz.opendatalab.egidio.backend.business.services.advertisement

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.annotation.security.PermitAll

/**
 * Service for Advertisement entity
 */
interface AdvertisementService {
    /**
     * Get page of advertisements that suite the given filter
     */
    @PermitAll
    fun getPage(filteredPageRequest : CustomFilteredPageRequest<AdvertisementFilter>) : CustomPage<Advertisement>

    /**
     * Get single advertisement by [slug]
     */
    @PermitAll
    fun getBySlug(slug : String) : Advertisement

    /**
     * Create new advertisement filled with data from given [advertisementCreateDto]
     */
    @PermitAll
    fun createAdvertisement(advertisementCreateDto : AdvertisementCreateDto) : Advertisement

    /**
     * Make advertisement identified by given [slug] accessible to public.
     */
    @PermitCoordinator
    fun publishAdvertisement(slug : String)

    /**
     * Cancel advertisement identified by given [slug] before it was resolved.
     *
     * For user to be able to cancel the advertisement,
     * he must either be an admin/coordinator or he must give us a valid token
     */
    @PermitAll
    fun cancelAdvertisement(slug : String, token : String? = null)

    /**
     * Mark current advertisement as resolved.
     *
     * For user to be able to resolve the advertisement,
     * he must either be an admin/coordinator or he must give us a valid token
     */
    @PermitAll
    fun resolveAdvertisement(slug : String, token : String? = null)
}