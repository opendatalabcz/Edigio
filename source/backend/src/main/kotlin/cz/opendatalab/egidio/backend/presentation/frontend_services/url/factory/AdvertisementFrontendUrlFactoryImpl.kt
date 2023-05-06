package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import cz.opendatalab.egidio.backend.business.custom_component_types.Factory

@Factory
class AdvertisementFrontendUrlFactoryImpl(
    val commonFrontendUrlFactory : CommonFrontendUrlFactory
) : AdvertisementFrontendUrlFactory {
    override fun createAdvertisementDetailUrl(slug : String) : String {
        return "${commonFrontendUrlFactory.createBaseUrl()}/advertisement/${slug}"
    }

    override fun createAdvertisementCancelUrl(slug : String, rawCancelToken : String) : String {
        return "${commonFrontendUrlFactory.createBaseUrl()}/advertisement/${slug}/cancel/${rawCancelToken}"
    }

    override fun createAdvertisementResolveUrl(slug : String, rawResolveToken : String) : String {
        return "${commonFrontendUrlFactory.createBaseUrl()}/advertisement/${slug}/resolve/${rawResolveToken}"
    }
}