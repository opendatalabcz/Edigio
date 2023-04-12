package cz.opendatalab.egidio.backend.shared.tokens

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken

/**
 * Token that also includes actually required value (not hashed or otherwise changed)
 */
data class ExpiringTokenWithRawValue<T>(
    val token : EmbeddableExpiringToken<T>,
    /**
     * Actual value of token stored in [token]
     */
    val rawValue: T
)
