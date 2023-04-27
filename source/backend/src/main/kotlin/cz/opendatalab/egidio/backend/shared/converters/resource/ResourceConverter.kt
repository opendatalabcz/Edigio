package cz.opendatalab.egidio.backend.shared.converters.resource

import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceDto
import cz.opendatalab.egidio.backend.presentation.dto.resource.ResourceShortDto

interface ResourceConverter {
    fun convertToDto(resource : Resource) : ResourceDto
    fun convertToShortDto(resource : Resource) : ResourceShortDto
}