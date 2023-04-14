package cz.opendatalab.egidio.backend.shared.converters.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.projections.project.ResponsePreviewAdvertisement
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementDetailDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementItemDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementShortDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponsePreviewAdvertisementDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.multilingual_text.MultilingualTextConverter
import cz.opendatalab.egidio.backend.shared.converters.resource.ResourceConverter

@ConverterComponent
class AdvertisementConverterImpl(
    val multilingualTextConverter: MultilingualTextConverter,
    val resourceConverter: ResourceConverter
) : AdvertisementConverter {
    override fun itemToDto(item: AdvertisementItem): AdvertisementItemDto = AdvertisementItemDto(
        resource = resourceConverter.convertToShortDto(item.resource),
        description = item.description?.let(multilingualTextConverter::convertMultilingualTextToDto),
        amount = item.amount
    )

    override fun entityToShortDto(entity: Advertisement): AdvertisementShortDto = AdvertisementShortDto(
        title = entity.title.let(multilingualTextConverter::convertMultilingualTextToDto),
        description = entity.description?.let(multilingualTextConverter::convertMultilingualTextToDto),
        type = entity.type,
        slug = entity.slug
    )

    override fun entityToDetailDto(entity: Advertisement): AdvertisementDetailDto = AdvertisementDetailDto(
        title = entity.title.let(multilingualTextConverter::convertMultilingualTextToDto),
        description = entity.description?.let(multilingualTextConverter::convertMultilingualTextToDto),
        type = entity.type,
        helpType = entity.helpType,
        status = entity.status,
        listedItems = entity.advertisementItems.map(::itemToDto),
        author = requireNotNull(entity.createdBy.publicId),
        createdAt = entity.createdAt,
        lastApprovedAt = entity.lastApprovedAt,
        lastApprovedBy = entity.lastApprovedBy?.publicId,
        lastEditedAt = entity.lastEditedAt,
        lastEditedBy = entity.lastEditedBy?.publicId,
        projectsSlugs = entity.projects.map { requireNotNull(it.slug) }.toSet(),
        slug = entity.slug
    )

    override fun entityToResponsePreview(entity : Advertisement) : ResponsePreviewAdvertisement
    = ResponsePreviewAdvertisement(
        slug = entity.slug,
        title = entity.title,
        type = entity.type
    )

    override fun responsePreviewToResponsePreviewDto(
        responsePreview : ResponsePreviewAdvertisement
    ) : ResponsePreviewAdvertisementDto = ResponsePreviewAdvertisementDto(
        slug = responsePreview.slug,
        title = multilingualTextConverter.convertMultilingualTextToDto(responsePreview.title),
        type = responsePreview.type
    )
}