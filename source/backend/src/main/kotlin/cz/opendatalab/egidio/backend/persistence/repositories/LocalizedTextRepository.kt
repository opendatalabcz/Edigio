package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import org.springframework.data.repository.CrudRepository

interface LocalizedTextRepository : CrudRepository<LocalizedText, Long> {
}