package cz.opendatalab.egidio.backend.presentation.frontend_services.url.factory

import java.util.UUID

/**
 * Factory for frontend URLs related to user
 */
interface UserFrontendUrlFactory {
    /**
     * Creates url for email confirmation. Url also includes raw token value.
     *
     * @param publicId public ID of user whose email should be confirmed
     * @param rawToken confirmation token in its raw (not hashed) form
     *
     */
    fun createEmailConfirmationUrl(publicId: UUID, rawToken: String) : String
}
