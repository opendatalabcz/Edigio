package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param
import java.util.UUID

interface AdvertisementResponseRepository : JpaRepository<AdvertisementResponse, Long> {
    fun findByPublicId(@Param("publicId") publicId: UUID) : AdvertisementResponse?
    fun findAllByResponseStatusAndCreatedById(responseStatus : ResponseStatus, id: Long) : List<AdvertisementResponse>
}