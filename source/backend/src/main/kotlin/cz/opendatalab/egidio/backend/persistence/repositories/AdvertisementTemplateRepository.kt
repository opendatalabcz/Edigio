package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import org.springframework.data.jpa.repository.JpaRepository

interface AdvertisementTemplateRepository : JpaRepository<AdvertisementTemplate, Long>