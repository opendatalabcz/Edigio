package cz.opendatalab.egidio.backend.persistence.repositories

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import org.springframework.data.repository.CrudRepository

interface LanguageRepository : CrudRepository<Language, Long> {
    fun findByCode(code: String): Language
}