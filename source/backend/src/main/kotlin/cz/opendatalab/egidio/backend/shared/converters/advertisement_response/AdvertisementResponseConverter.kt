package cz.opendatalab.egidio.backend.shared.converters.advertisement_response

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import cz.opendatalab.egidio.backend.business.entities.advertisement.response.ResponseItem
import cz.opendatalab.egidio.backend.business.projections.project.AdvertisementResponsePreview
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.AdvertisementResponsePreviewDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponseItemDto

interface AdvertisementResponseConverter {
    fun entityToPreview(
        entity : AdvertisementResponse,
        resolvableByUser : Boolean,
        resolvableByToken : Boolean
    ) : AdvertisementResponsePreview

    fun previewToPreviewDto(preview : AdvertisementResponsePreview) : AdvertisementResponsePreviewDto
    fun responseItemToResponseItemDto(responseItem : ResponseItem) : ResponseItemDto
}