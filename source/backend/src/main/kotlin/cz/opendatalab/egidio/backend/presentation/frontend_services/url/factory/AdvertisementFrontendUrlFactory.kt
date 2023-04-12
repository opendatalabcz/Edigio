package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

interface AdvertisementFrontendUrlFactory {
    fun createAdvertisementDetailUrl(slug: String)
    fun createAdvertisementCancelUrl(slug: String, rawCancelToken: String)
    fun createAdvertisementResolveUrl(slug: String, rawResolveToken: String)
}