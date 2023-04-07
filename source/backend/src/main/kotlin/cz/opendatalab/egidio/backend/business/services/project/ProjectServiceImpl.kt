package cz.opendatalab.egidio.backend.business.services.project

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import cz.opendatalab.egidio.backend.business.exceptions.not_all_found.NotAllProjectsFound
import cz.opendatalab.egidio.backend.business.exceptions.not_found.ProjectNotFoundException
import cz.opendatalab.egidio.backend.business.services.important_information.ImportantInformationService
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.business.services.user.AuthenticationService
import cz.opendatalab.egidio.backend.persistence.repositories.ProjectRepository
import cz.opendatalab.egidio.backend.presentation.dto.project.ProjectCreateDto
import cz.opendatalab.egidio.backend.shared.converters.page.PageConverter
import cz.opendatalab.egidio.backend.shared.filters.ProjectFilter
import cz.opendatalab.egidio.backend.shared.isSubsetOf
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import jakarta.transaction.Transactional
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime

@Service
@Transactional
class ProjectServiceImpl(
    private val projectRepository: ProjectRepository,
    private val authenticationService: AuthenticationService,
    private val importantInformationService: ImportantInformationService,
    private val multilingualTextService: MultilingualTextService,
    private val slugUtility: SlugUtility,
    private val pageConverter: PageConverter,
    private val clock: Clock
) : ProjectService {
    /**
     * When project is not prepared, it must be either published or archived
     * For both of these options project should be accessible for public
     */
    private fun projectAccessibleToPublic(project: Project) = project.status != ProjectStatus.PREPARED

    /**
     * Only coordinators and administrators have right to access projects that are not accessible to public
     */
    private fun loggedUserCanAccessOnlyPublicProjects() = !authenticationService.isAtLeastCoordinatorLoggedIn

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
                slug = slugUtility.createSlugWithLocalDateTimePrepended(
                    LocalDateTime.now(clock),
                    projectCreateDto.title.firstNonBlankText().text
                ),
                importantInformation = importantInformationService.getAllBySlugs(
                    projectCreateDto.importantInformationSlugs
                ).toMutableList(),
                status = ProjectStatus.PREPARED
            )
        )
    }

    override fun getBySlug(slug: String): Project {
        val project = getBySlugInternal(slug)
        if (!projectAccessibleToPublic(project) && loggedUserCanAccessOnlyPublicProjects()) {
            throw AccessDeniedException("User doesn't have access to the project!")
        }
        return project
    }

    override fun getProjectImportantInformation(slug: String): List<ImportantInformation> =
        getBySlug(slug).importantInformation


    private fun checkFilterAndFillRequiredFields(filter: ProjectFilter): ProjectFilter {
        val accessibleStatuses = accessibleProjectStatuses
        check(
            value = filter.projectStatuses?.isSubsetOf(accessibleStatuses) ?: true,
            lazyMessage = { "Filter contains status(es) not accessible to user!" }
        )
        return filter.takeUnless { it.projectStatuses == null }
            ?: filter.copy(projectStatuses = accessibleStatuses.toList())
    }

    override fun getPageByFilter(customFilteredPageRequest: CustomFilteredPageRequest<ProjectFilter>): CustomPage<Project> {
        return pageConverter.pageToCustomPage(
            projectRepository.getByFilter(
                checkFilterAndFillRequiredFields(customFilteredPageRequest.filter ?: ProjectFilter.of()),
                pageConverter.customPageRequestToPageRequest(customFilteredPageRequest.pageRequest)
            )
        )
    }

    private val accessibleProjectStatuses: Set<ProjectStatus>
        get() =
            if (!loggedUserCanAccessOnlyPublicProjects()) ProjectStatus.values().toSet()
            else setOf(ProjectStatus.PUBLISHED, ProjectStatus.ARCHIVED)


    override fun projectExistsAndAccessible(slug: String): Boolean {
        return projectRepository.existsBySlugAndStatusIsIn(slug, accessibleProjectStatuses)
    }

    override fun getAllBySlugs(slugs: List<String>): List<Project> {
        return projectRepository.findAllBySlugIn(slugs)
            .also { if(it.count() == slugs.count()) {
                throw NotAllProjectsFound()
            } }
            .also { projects ->
                if (loggedUserCanAccessOnlyPublicProjects() && projects.any { !projectAccessibleToPublic(it) }) {
                    throw AccessDeniedException("One or more projects not accessible to public")
                }
            }
    }

    override fun publish(slug: String) {
        val project = getBySlugInternal(slug)
        //Right now we only allow transition PREPARED => PUBLISHED (or ARCHIVED),
        // should we allow re-publishing (for example), then we must alter this check to also allow ARCHIVED state
        check(project.status == ProjectStatus.PREPARED, { "Project was already published!" })
        project.publishedAt = LocalDateTime.now(clock)
        project.status = ProjectStatus.PUBLISHED
        project.publishedBy = authenticationService.requireLoggedInUser()
    }

    override fun archive(slug: String) {
        val project = getBySlugInternal(slug)
        //Both PREPARED and PUBLISHED project are allowed to be archived.
        // Only no-no is re-archiving already archived project.
        check(project.status != ProjectStatus.ARCHIVED, { "Project has already been archived!" })
        project.archivedAt = LocalDateTime.now(clock)
        project.archivedBy = authenticationService.requireLoggedInUser()
        project.status = ProjectStatus.ARCHIVED
    }
}