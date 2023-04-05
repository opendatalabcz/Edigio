package cz.opendatalab.egidio.backend.business.services.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation

interface ImportantInformationService {
    fun getAllBySlugs(slugs: List<String>): List<ImportantInformation>
}