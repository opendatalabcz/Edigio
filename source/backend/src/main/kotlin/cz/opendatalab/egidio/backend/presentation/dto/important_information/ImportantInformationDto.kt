package cz.opendatalab.egidio.backend.presentation.dto.important_information

import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema

@Schema(
    description = "Important information that might be related to a project"
)
data class ImportantInformationDto (
    val slug: String,
    val title: MultilingualTextDto,
    val text: MultilingualTextDto,
    val links: List<ImportantInformationLinkDto>
)
