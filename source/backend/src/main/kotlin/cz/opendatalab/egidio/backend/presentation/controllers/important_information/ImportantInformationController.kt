package cz.opendatalab.egidio.backend.presentation.controllers.important_information

import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationDto
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping

@RequestMapping(
    name = "ImportantInformation",
    path = ["/important-information"]
)
interface ImportantInformationController {
    fun create(createDto: ImportantInformationCreateDto): ImportantInformationDto
}