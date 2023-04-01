package cz.opendatalab.egidio.backend.shared.tokens.checker

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import org.springframework.stereotype.Component

@Component
interface ExpiringTokenChecker<T> {
    fun checks(token: EmbeddableExpiringToken<T>, value: T) : Boolean
    fun nullableValueChecks(token: EmbeddableExpiringToken<T>, value: T?)
    = value != null && checks(token, value)
    fun nullableTokenAndValueChecks(token: EmbeddableExpiringToken<T>?, value: T?)
    = token != null && nullableValueChecks(token, value)
}