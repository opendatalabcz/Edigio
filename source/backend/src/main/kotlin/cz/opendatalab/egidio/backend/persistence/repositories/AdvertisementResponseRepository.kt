package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.query.Param
import java.util.UUID

interface AdvertisementResponseRepository : JpaRepository<AdvertisementResponse, Long> {
    fun findByPublicId(@Param("publicId") publicId: UUID) : AdvertisementResponse?
}