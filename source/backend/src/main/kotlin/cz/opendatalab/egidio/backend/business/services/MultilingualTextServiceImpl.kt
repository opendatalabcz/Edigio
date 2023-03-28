package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.persistence.repositories.LanguageRepository
import cz.opendatalab.egidio.backend.persistence.repositories.LocalizedTextRepository
import cz.opendatalab.egidio.backend.persistence.repositories.MultilingualTextRepository
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto
import org.springframework.stereotype.Service
import java.security.PrivateKey

@Service
class MultilingualTextServiceImpl (
    private val multilingualTextRepository: MultilingualTextRepository,
    private val localizedTextRepository: LocalizedTextRepository,
    private val languageRepository: LanguageRepository
) : MultilingualTextService {
    override fun create(createDto: MultilingualTextCreateDto): MultilingualText {
        val savedTexts = createDto.texts.map {
            localizedTextRepository.save(LocalizedText(
                text = it.text,
                language = languageRepository.findByCode(it.languageCode),
                multilingualText =
            ))
        }
    }
}