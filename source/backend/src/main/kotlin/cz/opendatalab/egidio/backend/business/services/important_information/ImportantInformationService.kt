package cz.opendatalab.egidio.backend.business.services.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationCreateDto

interface ImportantInformationService {
    fun create(importantInformation: ImportantInformationCreateDto) : ImportantInformation
    fun getAllBySlugs(slugs: List<String>): List<ImportantInformation>
}