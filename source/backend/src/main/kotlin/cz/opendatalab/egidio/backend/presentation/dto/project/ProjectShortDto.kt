package cz.opendatalab.egidio.backend.presentation.dto.project

import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Shortened variant of project"
)
data class ProjectShortDto(
    @field:Schema(
        description = "Project slug that can be used to identify the project",
        requiredMode = Schema.RequiredMode.NOT_REQUIRED
    )
    val slug : String?,
    @field:Schema(
        description = "Multilingual project title",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val title : MultilingualTextDto,
    @field:Schema(
        description = "Multilingual project description",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val description : MultilingualTextDto,
    @field:Schema(
        description = "Current status of the project",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val status: ProjectStatus
)
