package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import cz.opendatalab.egidio.backend.business.entities.advertisement.response.AdvertisementResponse
import java.util.*

/**
 * Factory creating frontend URLs related to [AdvertisementResponse]
 */
interface AdvertisementResponseFrontendUrlFactory {
    /**
     * Creates url to access advertisement response preview
     *
     * @param publicId public identifier of advertisement response
     * @param rawToken token that should be given as an access token to the response (either just for preview or edits)
     */
    fun createAdvertisementResponsePreviewUrl(publicId : UUID, rawToken : String?) : String
}