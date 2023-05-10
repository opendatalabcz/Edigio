package cz.opendatalab.egidio.backend.business.services.important_information

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationCreateDto
import jakarta.annotation.security.PermitAll

interface ImportantInformationService {
    @PermitCoordinator
    fun create(importantInformation: ImportantInformationCreateDto) : ImportantInformation
    @PermitAll
    fun getAllBySlugs(slugs: List<String>): List<ImportantInformation>
}