package cz.opendatalab.egidio.backend.presentation.dto.important_information

import cz.opendatalab.egidio.backend.shared.validation.annotations.MultilingualTextValid
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.URL

@Schema(
    description = "Single link related to importnant information"
)
data class ImportantInformationLinkDto(
    @field:NotNull
    @field:MultilingualTextValid
    @Schema(
        description = "Multilingual title of link",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val title: MultilingualTextDto,
    @field:NotNull
    @field:NotBlank
    @field:URL
    @Schema(
        description = "Location to which the link leads",
        requiredMode = Schema.RequiredMode.REQUIRED
    )
    val location: String
)