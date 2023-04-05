package cz.opendatalab.egidio.backend.business.services.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.persistence.repositories.ImportantInformationRepository
import org.springframework.stereotype.Service

@Service
class ImportantInformationServiceImpl(val repository: ImportantInformationRepository) : ImportantInformationService {
    override fun getAllBySlugs(slugs: List<String>): List<ImportantInformation> {
        return repository.findAllBySlugIn(slugs)
    }
}