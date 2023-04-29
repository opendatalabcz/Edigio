package cz.opendatalab.egidio.backend.data_access.repositories

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import org.springframework.data.repository.CrudRepository

interface LanguageRepository : CrudRepository<Language, Long> {
    fun findByCode(code: String): Language?
    fun findAllByCodeIn(codes: List<String>): List<Language>
}