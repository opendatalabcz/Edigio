package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

interface AdvertisementFrontendUrlFactory {
    fun createAdvertisementDetailUrl(slug : String) : String
    fun createAdvertisementCancelUrl(slug: String, rawCancelToken: String) : String
    fun createAdvertisementResolveUrl(slug: String, rawResolveToken: String) : String
}