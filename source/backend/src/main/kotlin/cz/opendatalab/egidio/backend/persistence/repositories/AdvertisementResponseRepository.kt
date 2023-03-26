package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import org.springframework.data.jpa.repository.JpaRepository

interface AdvertisementResponseRepository : JpaRepository<AdvertisementResponse, Long>