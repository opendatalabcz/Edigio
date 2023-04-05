package cz.opendatalab.egidio.backend.business.services.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformationLink
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.persistence.repositories.ImportantInformationRepository
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationCreateDto
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.net.URL
import java.time.Clock
import java.time.LocalDateTime

@Service
@Transactional
class ImportantInformationServiceImpl(
    val repository: ImportantInformationRepository,
    val multilingualTextService: MultilingualTextService,
    val slugUtility: SlugUtility,
    val clock: Clock
) : ImportantInformationService {
    override fun create(importantInformation: ImportantInformationCreateDto): ImportantInformation {
        return repository.save(
            ImportantInformation(
                title = multilingualTextService.create(importantInformation.title),
                text = multilingualTextService.create(importantInformation.text),
                links = importantInformation.links.map {
                    ImportantInformationLink(
                        title = multilingualTextService.create(it.title),
                        location = URL(it.location)
                    )
                },
                slug = slugUtility.createSlug(
                    slugUtility.createLocalDateTimeSlug(LocalDateTime.now(clock)),
                    importantInformation.title.firstNonBlankText().text
                ),
                id = null
            )
        )
    }

    override fun getAllBySlugs(slugs: List<String>): List<ImportantInformation> {
        return repository.findAllBySlugIn(slugs)
    }
}