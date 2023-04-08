package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.business.exceptions.not_found.AdvertisementTemplateNotFoundException
import cz.opendatalab.egidio.backend.business.services.multilingual_text.MultilingualTextService
import cz.opendatalab.egidio.backend.business.services.project.ProjectService
import cz.opendatalab.egidio.backend.business.services.resource.ResourceService
import cz.opendatalab.egidio.backend.persistence.repositories.AdvertisementTemplateRepository
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_template.AdvertisementTemplateCreateDto
import cz.opendatalab.egidio.backend.shared.converters.page.PageConverter
import cz.opendatalab.egidio.backend.shared.filters.AdvertisementTemplateFilter
import cz.opendatalab.egidio.backend.shared.pagination.CustomFilteredPageRequest
import cz.opendatalab.egidio.backend.shared.pagination.CustomPage
import cz.opendatalab.egidio.backend.shared.slug.SlugUtility
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime

@Service
@Transactional
class AdvertisementTemplateServiceImpl(
    val advertisementTemplateRepository: AdvertisementTemplateRepository,
    val resourceService: ResourceService,
    val projectsService: ProjectService,
    val multilingualTextService: MultilingualTextService,
    val pageConverter: PageConverter,
    val slugUtility: SlugUtility,
    val clock: Clock
) : AdvertisementTemplateService {
    override fun create(createDto: AdvertisementTemplateCreateDto): AdvertisementTemplate {
        val resources = resourceService.getAllBySlugs(slugs = createDto.recommendedResourcesSlugs)
        val projects = projectsService.getAllBySlugs(slugs = createDto.projectsSlugs)
        return advertisementTemplateRepository.save(
            AdvertisementTemplate(
                id = null,
                name = multilingualTextService.create(createDto.name),
                description = createDto.description?.let(multilingualTextService::create),
                recommendedResources = resources.toMutableList(),
                projects = projects.toMutableSet(),
                catastropheTypes = createDto.catastropheTypes.toMutableSet(),
                advertisementTypes = createDto.advertisementTypes.toMutableSet(),
                helpTypes = createDto.helpTypes.toMutableSet(),
                slug = slugUtility.createSlugWithLocalDateTimePrepended(
                    localDateTime = LocalDateTime.now(clock),
                    createDto.name.firstNonBlankText().text
                )
            )
        )
    }

    private val defaultFilter
        get() = AdvertisementTemplateFilter()

    override fun getBySlug(slug: String) : AdvertisementTemplate {
        return advertisementTemplateRepository.findBySlug(slug) ?: throw AdvertisementTemplateNotFoundException()
    }

    override fun getPageByFilter(
        filteredPageRequest: CustomFilteredPageRequest<AdvertisementTemplateFilter>
    ) : CustomPage<AdvertisementTemplate> {
        return advertisementTemplateRepository
            .getPageByFilter(
                filteredPageRequest.filter ?: defaultFilter,
                filteredPageRequest.pageRequest.let(pageConverter::customPageRequestToPageRequest)
            )
            .let(pageConverter::pageToCustomPage)
    }
}