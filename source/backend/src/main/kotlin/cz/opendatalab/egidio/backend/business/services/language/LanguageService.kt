package cz.opendatalab.egidio.backend.business.services.language

import cz.opendatalab.egidio.backend.business.entities.localization.Language

interface LanguageService {
    fun getByCode(code: String): Language
    fun getAllByCodes(codes: List<String>): List<Language>
}