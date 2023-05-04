package cz.opendatalab.egidio.backend.presentation.dto.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Structure that can be used to create new AdvertisementTemplate"
)
data class AdvertisementTemplateCreateDto(
    @Schema(
        description = "Short, descriptive, name of template",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val name: MultilingualTextDto,
    @Schema(
        description = "Longer description of template",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val description: MultilingualTextDto?,
    @Schema(
        description = "Slugs of resources recommended by template",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val recommendedResourcesSlugs: List<String>,
    @Schema(
        description = "Slugs of projects for which the template is specified",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val projectsSlugs: List<String>,
    @Schema(
        description = "Types of catastrophes for which the template is specified",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val catastropheTypes: Set<CatastropheType>,
    @Schema(
        description = "Types of advertisements for which the template is specified",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val advertisementTypes: Set<AdvertisementType>,
    @Schema(
        description = "Types of helps for which the template is specified",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val helpTypes: Set<AdvertisementHelpType>
)
