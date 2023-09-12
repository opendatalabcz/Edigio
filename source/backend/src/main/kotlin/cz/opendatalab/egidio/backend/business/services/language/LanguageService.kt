package cz.opendatalab.egidio.backend.business.services.language

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import jakarta.annotation.security.PermitAll

interface LanguageService {
    @PermitAll
    fun getByCode(code: String): Language
    @PermitAll
    fun getAllByCodes(codes: List<String>): List<Language>
}