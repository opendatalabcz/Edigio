package cz.opendatalab.egidio.backend.business.services.project

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
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
    fun projectExists(slug: String): Boolean

    @PermitCoordinator
    fun publish(slug: String)

    @PermitCoordinator
    fun archive(slug: String)

    @PermitCoordinator
    fun create(projectCreateDto: ProjectCreateDto): Project
}