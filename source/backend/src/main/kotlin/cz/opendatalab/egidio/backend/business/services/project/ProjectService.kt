package cz.opendatalab.egidio.backend.business.services.project

import cz.opendatalab.egidio.backend.business.authentication.annotations.PermitCoordinator
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.presentation.dto.ProjectCreateDto
import jakarta.annotation.security.PermitAll

interface ProjectService {
    @PermitAll
    fun getBySlug(slug: String): Project

    @PermitCoordinator
    fun publish(slug: String)

    @PermitCoordinator
    fun archive(slug: String)

    @PermitCoordinator
    fun create(projectCreateDto: ProjectCreateDto): Project
}