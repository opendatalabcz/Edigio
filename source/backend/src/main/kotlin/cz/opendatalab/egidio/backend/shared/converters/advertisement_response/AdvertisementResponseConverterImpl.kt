package cz.opendatalab.egidio.backend.shared.converters.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.projections.project.AdvertisementResponsePreview
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponsePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponseItemDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent
import cz.opendatalab.egidio.backend.shared.converters.advertisement.AdvertisementConverter
import cz.opendatalab.egidio.backend.shared.converters.resource.ResourceConverter
import cz.opendatalab.egidio.backend.shared.converters.user.UserConverter

@ConverterComponent
class AdvertisementResponseConverterImpl(
    private val userConverter : UserConverter,
    private val advertisementConverter : AdvertisementConverter,
    private val resourceConverter : ResourceConverter
) : AdvertisementResponseConverter {
    override fun responseItemToResponseItemDto(responseItem : ResponseItem) : ResponseItemDto = ResponseItemDto(
        resource = resourceConverter.convertToShortDto(responseItem.resource),
        description = responseItem.description,
        amount = responseItem.amount
    )

    override fun entityToPreview(
        entity : AdvertisementResponse,
        resolvableByUser : Boolean,
        resolvableByToken : Boolean
    ) : AdvertisementResponsePreview = AdvertisementResponsePreview(
        publicId = entity.publicId,
        advertisement = advertisementConverter.entityToResponsePreview(entity.advertisement),
        listedItems = entity.responseItems,
        responder = userConverter.userToPublicUserInfo(entity.createdBy),
        responderNote = entity.responderNote,
        advertiserNote = entity.advertiserNote,
        status = entity.responseStatus,
        resolvableByUser = resolvableByUser,
        resolvableByToken = resolvableByToken,
        createdAt = entity.createdAt,
        resolvedAt = entity.resolvedAt,
    )

    override fun previewToPreviewDto(preview : AdvertisementResponsePreview) = AdvertisementResponsePreviewDto(
        publicId = preview.publicId,
        advertisement = advertisementConverter.responsePreviewToResponsePreviewDto(preview.advertisement),
        listedItems = preview.listedItems.map ( this::responseItemToResponseItemDto ),
        responder = userConverter.publicInfoToPublicInfoDto(preview.responder),
        responderNote = preview.responderNote,
        advertiserNote = preview.advertiserNote,
        status = preview.status,
        resolvableByUser = preview.resolvableByUser,
        resolvableByToken = preview.resolvableByToken,
        createdAt = preview.createdAt,
        resolvedAt = preview.resolvedAt
    )
}