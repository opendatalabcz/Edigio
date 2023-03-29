package cz.opendatalab.egidio.backend.shared.tokens

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import kotlin.time.Duration

interface ExpiringTokenFactory<T> {
    fun create(validityDuration: Duration? = null) : EmbeddableExpiringToken<T>
}