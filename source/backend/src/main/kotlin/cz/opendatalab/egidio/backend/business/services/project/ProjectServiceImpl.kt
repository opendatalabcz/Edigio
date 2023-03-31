package cz.opendatalab.egidio.backend.business.services.project

import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import cz.opendatalab.egidio.backend.business.exceptions.not_found.ProjectNotFoundException
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.persistence.repositories.ProjectRepository
import cz.opendatalab.egidio.backend.presentation.dto.ProjectCreateDto
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime

@Service
class ProjectServiceImpl(
    private val projectRepository: ProjectRepository,
    private val authenticationService: AuthenticationService,
    private val multilingualTextService: MultilingualTextService,
    private val slugUtility: SlugUtility,
    private val clock: Clock
) : ProjectService {
    private fun projectAccessibleToPublic(project: Project) = project.status != ProjectStatus.PREPARED

    private fun getBySlugInternal(slug: String): Project {
        return projectRepository.findBySlug(slug) ?: throw ProjectNotFoundException()
    }

    override fun create(projectCreateDto: ProjectCreateDto): Project {
        return projectRepository.save(
            Project(
                title = multilingualTextService.create(projectCreateDto.title),
                description = multilingualTextService.create(projectCreateDto.description),
                catastropheType = projectCreateDto.catastropheType,
                advertisements = mutableListOf(),
                createdAt = LocalDateTime.now(clock),
                createdBy = authenticationService.requireLoggedInUser(),
                updatedAt = null,
                updatedBy = null,
                publishedAt = null,
                publishedBy = null,
                archivedAt = null,
                archivedBy = null,
                slug = slugUtility.createSlug(
                    slugUtility.createLocalDateTimeSlug(LocalDateTime.now(clock)),
                    projectCreateDto.title.firstNonBlankText().text
                ),
                status = ProjectStatus.PREPARED
            )
        )
    }

    override fun getBySlug(slug: String): Project {
        val project = getBySlugInternal(slug)
        if (!authenticationService.isAtLeastCoordinatorLoggedIn && !projectAccessibleToPublic(project)) {
            throw AccessDeniedException("User doesn't have access to the project!")
        }
        return project
    }

    override fun publish(slug: String) {
        val project = getBySlugInternal(slug)
        check(project.status == ProjectStatus.PREPARED, { "Project was already published!" })
        project.publishedAt = LocalDateTime.now(clock)
        project.publishedBy = authenticationService.requireLoggedInUser()
        project.status = ProjectStatus.PUBLISHED
    }

    override fun archive(slug: String) {
        val project = getBySlugInternal(slug)
        check(project.status != ProjectStatus.ARCHIVED, { "Project has already been archived!" })
        project.archivedAt = LocalDateTime.now(clock)
        project.archivedBy = authenticationService.requireLoggedInUser()
        project.status = ProjectStatus.ARCHIVED
    }
}