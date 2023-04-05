package cz.opendatalab.egidio.backend.presentation.controllers.important_information

import cz.opendatalab.egidio.backend.business.services.important_information.ImportantInformationService
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationDto
import cz.opendatalab.egidio.backend.shared.converters.important_information.ImportantInformationConverter
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(
    name = "ImportantInformation",
    path = ["/important-information"]
)
class ImportantInformationControllerImpl(
    val importantInformationService: ImportantInformationService,
    val importantInformationConverter: ImportantInformationConverter
) : ImportantInformationController {
    @PostMapping(name = "ImportantInformation_create")
    @ResponseStatus(code = HttpStatus.CREATED)
    override fun create(@RequestBody @Valid createDto: ImportantInformationCreateDto): ImportantInformationDto {
        return importantInformationService.create(createDto)
            .let(importantInformationConverter::convertImportantInformationToDto)
    }
}