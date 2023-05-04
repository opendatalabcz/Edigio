package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Structure used to create new project"
)
data class ProjectCreateDto(
    @Schema(
        description = "Multilingual project title",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val title: MultilingualTextDto,
    @Schema(
        description = "Multilingual project description",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val description: MultilingualTextDto,
    @Schema(
        description = "Important information somehow related to project",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED,
        nullable = false
    )
    val importantInformationSlugs: List<String>,
    @Schema(
        description = "Multilingual project title",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val catastropheType: CatastropheType
)
