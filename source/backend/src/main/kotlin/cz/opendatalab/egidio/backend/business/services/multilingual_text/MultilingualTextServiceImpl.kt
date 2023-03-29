package cz.opendatalab.egidio.backend.business.services.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.persistence.repositories.LanguageRepository
import cz.opendatalab.egidio.backend.persistence.repositories.LocalizedTextRepository
import cz.opendatalab.egidio.backend.persistence.repositories.MultilingualTextRepository
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.LocalizedTextDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextCreateDto
import org.springframework.stereotype.Service

@Service
class MultilingualTextServiceImpl (
    private val multilingualTextRepository: MultilingualTextRepository,
    private val localizedTextRepository: LocalizedTextRepository,
    private val languageRepository: LanguageRepository
) : MultilingualTextService {
    private fun localizedTextFromDto(localizedTextDto: LocalizedTextDto) : LocalizedText {
        return LocalizedText(
            text = localizedTextDto.text,
            language = languageRepository.findByCode(code = localizedTextDto.languageCode),
        )
    }

    override fun create(createDto: MultilingualTextCreateDto): MultilingualText {
        return this.multilingualTextRepository.save(MultilingualText(
            defaultTextLanguage = languageRepository.findByCode(code = createDto.defaultLanguageCode),
            texts = createDto.texts.map(this::localizedTextFromDto).toMutableList()
        ))
    }
}