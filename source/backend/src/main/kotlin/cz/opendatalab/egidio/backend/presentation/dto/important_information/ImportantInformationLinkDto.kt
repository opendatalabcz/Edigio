package cz.opendatalab.egidio.backend.presentation.dto.important_information

import cz.opendatalab.egidio.backend.business.entities.constraints.multilingual_text.MultilingualTextValid
import cz.opendatalab.egidio.backend.presentation.dto.multilingual_text.MultilingualTextDto
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.hibernate.validator.constraints.URL

data class ImportantInformationLinkDto(
    @field:NotNull
    @field:MultilingualTextValid
    val title: MultilingualTextDto,
    @field:NotNull
    @field:NotBlank
    @field:URL
    val location: String
)