package cz.opendatalab.egidio.backend.business.services.multilingual_text

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.services.language.LanguageService
import cz.opendatalab.egidio.backend.data_access.repositories.MultilingualTextRepository
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.LocalizedTextDto
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import org.springframework.stereotype.Service

@Service
class MultilingualTextServiceImpl (
    private val multilingualTextRepository: MultilingualTextRepository,
    private val languageService: LanguageService
) : MultilingualTextService {
    private fun localizedTextFromDto(localizedTextDto: LocalizedTextDto) : LocalizedText {
        return LocalizedText(
            text = localizedTextDto.text,
            language = languageService.getByCode(code = localizedTextDto.languageCode)
        )
    }

    override fun create(createDto: MultilingualTextDto): MultilingualText {
        return this.multilingualTextRepository.save(MultilingualText(
            defaultTextLanguage =  languageService.getByCode(code = createDto.defaultLanguageCode),
            texts = createDto.texts.map(this::localizedTextFromDto).toMutableList()
        ))
    }
}