package cz.opendatalab.egidio.backend.presentation.controllers.important_information

import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationDto
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping

@RequestMapping(
    name = "ImportantInformation",
    path = ["/important-information"]
)
interface ImportantInformationController {
    @PostMapping(name = "ImportantInformation_create")
    fun create(@RequestBody @Valid createDto: ImportantInformationDto)
}