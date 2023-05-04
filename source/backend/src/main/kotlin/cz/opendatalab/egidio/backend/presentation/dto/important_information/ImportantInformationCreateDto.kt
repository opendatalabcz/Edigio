package cz.opendatalab.egidio.backend.presentation.dto.important_information

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema


@Schema(
    description = "Structure used to create important information that might be related to a project"
)
data class ImportantInformationCreateDto (
    @field:Schema(
        description = "Multilingual title of the information",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val title: MultilingualTextDto,
    @field:Schema(
        description = "Multilingual descriptive text of the information",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val text: MultilingualTextDto,
    @field:Schema(
        description = "Links related to information",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val links: List<ImportantInformationLinkDto>
)
