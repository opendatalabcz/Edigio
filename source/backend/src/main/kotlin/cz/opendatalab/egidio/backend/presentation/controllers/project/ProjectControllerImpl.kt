package cz.opendatalab.egidio.backend.presentation.controllers.project

import cz.opendatalab.egidio.backend.business.services.project.ProjectService
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectDetailPageDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectShortDto
import cz.opendatalab.egidio.backend.shared.converters.project.ProjectConverter
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder
import java.net.URI

@RestController
@RequestMapping(
    name = "ProjectController",
    path = ["/project"]
)
class ProjectControllerImpl(
    val projectService: ProjectService,
    val projectConverter: ProjectConverter
) : ProjectController {
    override fun getPageByFilter(
        @Valid customFilteredPageRequest: CustomFilteredPageRequest<ProjectFilter>
    ): ResponseEntity<CustomPage<ProjectShortDto>> {
        return ResponseEntity.ok(
            projectService
                .getPageByFilter(customFilteredPageRequest)
                .map(projectConverter::projectToShortDto)
        )
    }

    override fun getShortBySlug(slug: String): ResponseEntity<ProjectShortDto> {
        return ResponseEntity.ok(projectService.getBySlug(slug).let(projectConverter::projectToShortDto))
    }

    @GetMapping(
        name = PROJECT_DETAIL_PAGE_GET_MAPPING_NAME,
        path = ["/{slug}/details-page/"]
    )
    override fun getProjectDetailPage(slug: String): ResponseEntity<ProjectDetailPageDto> {
        return ResponseEntity.ok(projectService.getBySlug(slug).let(projectConverter::projectToDetailPageDto))
    }

    override fun projectExists(slug: String): ResponseEntity<Boolean> {
        return ResponseEntity.ok(projectService.projectExists(slug))
    }

    override fun createProject(projectCreateDto: ProjectCreateDto): ResponseEntity<String> {
        return ResponseEntity.created(
            projectService.create(projectCreateDto).let {
                URI(MvcUriComponentsBuilder
                    .fromMappingName(PROJECT_DETAIL_PAGE_GET_MAPPING_NAME)
                    .buildAndExpand())
            }
        ).build()
    }

    @ResponseStatus(HttpStatus.OK)
    override fun publishProject(slug: String) {
        projectService.publish(slug)
    }

    companion object {
        const val PROJECT_DETAIL_PAGE_GET_MAPPING_NAME = "getProjectDetailPage"
    }
}