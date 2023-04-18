package cz.opendatalab.egidio.backend.shared.tokens.factory

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.shared.tokens.ExpiringTokenWithRawValue
import kotlin.time.Duration

interface ExpiringTokenFactory<T> {
    /**
     * Create regular token
     */
    fun create(validityDuration : Duration? = null) : EmbeddableExpiringToken<T>

    /**
     * Create regular token with raw value included
     */
    fun createWithRawValueIncluded(
        validityDuration : Duration? = null,
    ) : ExpiringTokenWithRawValue<T>

    /**
     * Create token whose raw value is much short shorter than regular token raw value
     */
    fun createShort(validityDuration : Duration? = null) : EmbeddableExpiringToken<T>

    /**
     * Create short token with its raw value included
     */
    fun createShortWithRawValueIncluded(
        validityDuration : Duration? = null
    ) : ExpiringTokenWithRawValue<String>
}