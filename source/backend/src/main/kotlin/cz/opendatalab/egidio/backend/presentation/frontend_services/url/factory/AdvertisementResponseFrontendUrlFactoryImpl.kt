package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import cz.opendatalab.egidio.backend.business.custom_component_types.Factory
import java.util.*

@Factory
class AdvertisementResponseFrontendUrlFactoryImpl(
    val commonFrontendUrlFactory : CommonFrontendUrlFactory
) : AdvertisementResponseFrontendUrlFactory {
    override fun createAdvertisementResponsePreviewUrl(publicId : UUID, rawToken : String?) : String {
        //Postfix is used for access token.
        //When no token is given, no postfix should be appended.
        val postfix = rawToken?.let { "/${it}" } ?: ""
        return "${commonFrontendUrlFactory.createBaseUrl()}/advertisement-response/${publicId}/preview${postfix}"
    }
}