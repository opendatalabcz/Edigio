package cz.opendatalab.egidio.backend.business.services.advertisement

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.annotation.security.DenyAll
import jakarta.annotation.security.PermitAll

interface AdvertisementService {
    @PermitAll
    fun getPage(pageRequest: CustomFilteredPageRequest<AdvertisementFilter>): CustomPage<Advertisement>

    @PermitAll
    fun getBySlug(slug: String): Advertisement

    @PermitAll
    fun createAdvertisement(advertisementCreateDto: AdvertisementCreateDto) : Advertisement

    @PermitCoordinator
    fun publishAdvertisement(slug: String)

    @DenyAll
    fun cancelAdvertisement(slug: String, token: String? = null)

    @DenyAll
    fun resolveAdvertisement(slug: String, token: String? = null)
}