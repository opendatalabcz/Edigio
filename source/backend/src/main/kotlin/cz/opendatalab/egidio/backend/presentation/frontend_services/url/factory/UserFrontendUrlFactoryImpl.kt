package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import cz.opendatalab.egidio.backend.business.custom_component_types.Factory
import java.util.*

@Factory
class UserFrontendUrlFactoryImpl(
    val commonFrontendUrlFactory : CommonFrontendUrlFactory
) : UserFrontendUrlFactory {
    override fun createEmailConfirmationUrl(publicId : UUID, rawToken : String) : String
    = "${commonFrontendUrlFactory.createBaseUrl()}/user/${publicId}/confirm-email/${rawToken}"
}