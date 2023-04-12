package cz.opendatalab.egidio.backend.shared.tokens.factory

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.shared.tokens.ExpiringTokenWithRawValue
import kotlin.time.Duration

interface ExpiringTokenFactory<T> {
    fun create(validityDuration : Duration? = null, onIssue : (rawToken : T) -> Unit) : EmbeddableExpiringToken<T>
    fun createWithRawValueIncluded(
        validityDuration : Duration? = null,
        onIssue : (rawToken : T) -> Unit
    ) : ExpiringTokenWithRawValue<T>
}