package cz.opendatalab.egidio.backend.shared.tokens

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken

data class ExpiringTokenWithRawValue<T>(
    val token : EmbeddableExpiringToken<T>,
    val rawValue: T
)
