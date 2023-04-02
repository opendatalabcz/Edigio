package cz.opendatalab.egidio.backend.shared.converters.project

import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectDetailPageDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectShortDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter

@ConverterComponent
class ProjectConverterImpl(val multilingualTextConverter: MultilingualTextConverter) : ProjectConverter {
    override fun projectToShortDto(project: Project): ProjectShortDto {
        return ProjectShortDto(
            title = multilingualTextConverter.convertMultilingualTextToMultilingualTextDto(project.title),
            description = multilingualTextConverter.convertMultilingualTextToMultilingualTextDto(project.description)
        )
    }

    override fun projectToDetailPageDto(project: Project): ProjectDetailPageDto {
        return ProjectDetailPageDto(
            title = multilingualTextConverter.convertMultilingualTextToMultilingualTextDto(project.title),
            description = multilingualTextConverter.convertMultilingualTextToMultilingualTextDto(project.description)
        )
    }
}