package cz.opendatalab.egidio.backend.business.services.project

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectCreateDto
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import jakarta.annotation.security.PermitAll
import jakarta.validation.Valid

interface ProjectService {
    @PermitAll
    fun getBySlug(slug: String): Project

    @PermitAll
    fun getPageByFilter(@Valid customFilteredPageRequest: CustomFilteredPageRequest<ProjectFilter>) : CustomPage<Project>

    @PermitAll
    fun projectExistsAndAccessible(slug: String): Boolean

    @PermitAll
    fun getAllBySlugs(slugs: List<String>): List<Project>

    @PermitCoordinator
    fun publish(slug: String)

    @PermitCoordinator
    fun archive(slug: String)

    @PermitCoordinator
    fun create(projectCreateDto: ProjectCreateDto): Project

    @PermitAll
    fun getProjectImportantInformation(slug: String): List<ImportantInformation>
}