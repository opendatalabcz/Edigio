package cz.opendatalab.egidio.backend.shared.converters.advertisement

import cz.opendatalab.egidio.backend.business.entities.advertisement.Advertisement
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementItem
import cz.opendatalab.egidio.backend.business.projections.project.ResponsePreviewAdvertisement
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementDetailDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementItemDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement.AdvertisementShortDto
import cz.opendatalab.egidio.backend.presentation.dto.advertisement_response.ResponsePreviewAdvertisementDto

interface AdvertisementConverter {
    fun itemToDto(item : AdvertisementItem) : AdvertisementItemDto
    fun entityToShortDto(entity : Advertisement) : AdvertisementShortDto
    fun entityToDetailDto(entity : Advertisement) : AdvertisementDetailDto
    fun entityToResponsePreview(entity : Advertisement) : ResponsePreviewAdvertisement
    fun responsePreviewToResponsePreviewDto(responsePreview : ResponsePreviewAdvertisement) : ResponsePreviewAdvertisementDto
}