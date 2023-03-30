package cz.opendatalab.egidio.backend.business.services.language

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import cz.opendatalab.egidio.backend.business.exceptions.not_all_found.NotAllLanguagesFound
import cz.opendatalab.egidio.backend.business.exceptions.not_found.LanguageNotFoundException
import cz.opendatalab.egidio.backend.persistence.repositories.LanguageRepository
import org.springframework.stereotype.Service

@Service
class LanguageServiceImpl(val languageRepository: LanguageRepository) : LanguageService {
    override fun getByCode(code: String) : Language {
        return languageRepository.findByCode(code) ?: throw LanguageNotFoundException()
    }

    override fun getAllByCodes(codes: List<String>) : List<Language> {
        return languageRepository.findAllByCodeIn(codes).takeIf { it.size == codes.size } ?: throw NotAllLanguagesFound()
    }
}