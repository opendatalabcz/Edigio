package cz.opendatalab.egidio.backend.presentation.controllers.project

import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectDetailPageDto
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectShortDto
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import org.springframework.http.ResponseEntity

interface ProjectController {
    fun getPageByFilter(customFilteredPageRequest: CustomFilteredPageRequest<ProjectFilter>) : ResponseEntity<CustomPage<ProjectShortDto>>
    fun getProjectDetailPage(slug: String) : ResponseEntity<ProjectDetailPageDto>
    fun projectExistsAndAccessible(slug: String): ResponseEntity<Boolean>
    fun getShortBySlug(slug: String): ResponseEntity<ProjectShortDto>
    fun createProject(projectCreateDto: ProjectCreateDto) : ResponseEntity<String>
    fun publishProject(slug: String)
}