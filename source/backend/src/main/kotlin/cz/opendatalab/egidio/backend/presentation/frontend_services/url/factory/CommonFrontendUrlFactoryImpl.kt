package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import cz.opendatalab.egidio.backend.business.custom_component_types.Factory
import org.springframework.beans.factory.annotation.Value

@Factory
class CommonFrontendUrlFactoryImpl(
    @Value("frontend.url") val baseUrl: String,
) : CommonFrontendUrlFactory {

    override fun createBaseUrl() : String
    = baseUrl
}