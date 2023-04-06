package cz.opendatalab.egidio.backend.presentation.controllers.project

import cz.opendatalab.egidio.backend.business.services.project.ProjectService
import cz.opendatalab.egidio.backend.presentation.controllers.project.ProjectControllerImpl.Companion.CONTROLLER_MAPPING_NAME
import cz.opendatalab.egidio.backend.presentation.dto.important_information.ImportantInformationDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectDetailPageDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectShortDto
import cz.opendatalab.egidio.backend.shared.converters.important_information.ImportantInformationConverter
import cz.opendatalab.egidio.backend.shared.converters.project.ProjectConverter
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder
import java.net.URI

@RestController
@RequestMapping(
    name = CONTROLLER_MAPPING_NAME,
    path = ["/project"]
)
class ProjectControllerImpl(
    val projectService: ProjectService,
    val projectConverter: ProjectConverter,
    val importantInformationConverter: ImportantInformationConverter
) : ProjectController {
    @PostMapping(
        name = "getPageByFilter",
        path = ["/filtered-page"]
    )
    override fun getPageByFilter(
        @RequestBody @Valid customFilteredPageRequest: CustomFilteredPageRequest<ProjectFilter>
    ): ResponseEntity<CustomPage<ProjectShortDto>> {
        return ResponseEntity.ok(
            projectService
                .getPageByFilter(customFilteredPageRequest)
                .map(projectConverter::projectToShortDto)
        )
    }

    @GetMapping(
        name = "getShortBySlug",
        path = ["/{slug}/short"]
    )
    override fun getShortBySlug(@PathVariable("slug") slug: String): ResponseEntity<ProjectShortDto> {
        return ResponseEntity.ok(projectService.getBySlug(slug).let(projectConverter::projectToShortDto))
    }

    @GetMapping(
        name = PROJECT_DETAIL_PAGE_GET_MAPPING_NAME,
        path = ["/{slug}/details-page"]
    )
    override fun getProjectDetailPage(@PathVariable("slug") slug: String): ResponseEntity<ProjectDetailPageDto> {
        return ResponseEntity.ok(projectService.getBySlug(slug).let(projectConverter::projectToDetailPageDto))
    }

    @GetMapping(
        name = "existsAndAccessible",
        path = ["/{slug}/exists-and-accessible"]
    )
    override fun projectExistsAndAccessible(@PathVariable("slug") slug: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(projectService.projectExistsAndAccessible(slug))
    }

    @PostMapping(
        name = "createProject",
        path = ["/"]
    )
    override fun createProject(@RequestBody @Valid projectCreateDto: ProjectCreateDto): ResponseEntity<String> {
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(projectService.create(projectCreateDto).slug)
    }

    @ResponseStatus(HttpStatus.OK)
    @PostMapping(
        name = "publishProject",
        path = ["/{slug}/publish"]
    )
    override fun publishProject(@PathVariable slug: String) {
        projectService.publish(slug)
    }

    @ResponseStatus(HttpStatus.OK)
    @GetMapping(
        name = "getImportantInformation",
        path = ["/{slug}/important-information"]
    )
    fun getImportantInformation(@PathVariable("slug") slug: String) : List<ImportantInformationDto> {
        return this.projectService
            .getProjectImportantInformation(slug)
            .map(importantInformationConverter::convertImportantInformationToDto)

    }

    companion object {
        const val CONTROLLER_MAPPING_NAME = "ProjectController"
        const val PROJECT_DETAIL_PAGE_GET_MAPPING_NAME = "getProjectDetailPage"
    }
}