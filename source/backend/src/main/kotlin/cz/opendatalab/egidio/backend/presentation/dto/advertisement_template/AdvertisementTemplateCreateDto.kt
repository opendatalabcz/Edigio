package cz.opendatalab.egidio.backend.presentation.dto.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto

data class AdvertisementTemplateCreateDto(
    val name: MultilingualTextDto,
    val description: MultilingualTextDto?,
    val recommendedResourcesSlugs: List<String>,
    val projectsSlugs: List<String>,
    val catastropheTypes: Set<CatastropheType>,
    val advertisementTypes: Set<AdvertisementType>,
    val helpTypes: Set<AdvertisementHelpType>
)
