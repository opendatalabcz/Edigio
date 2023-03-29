package cz.opendatalab.egidio.backend.business.services.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementCreateDto
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomPageRequest
import jakarta.annotation.security.DenyAll
import jakarta.annotation.security.PermitAll
import org.springframework.data.domain.Page
import java.util.*

interface AdvertisementService {
    @PermitAll
    fun getPage(pageRequest: CustomPageRequest, filter: AdvertisementFilter?): Page<Advertisement>

    @PermitAll
    fun getBySlug(slug: String): Advertisement

    @PermitAll
    fun createAdvertisement(advertisement: AdvertisementCreateDto) : Advertisement

    @DenyAll
    fun publishAdvertisement(slug: String)

    @DenyAll
    fun cancelAdvertisement(slug: String, token: UUID? = null)

    @DenyAll
    fun resolveAdvertisement(slug: String, token: String? = null)
}