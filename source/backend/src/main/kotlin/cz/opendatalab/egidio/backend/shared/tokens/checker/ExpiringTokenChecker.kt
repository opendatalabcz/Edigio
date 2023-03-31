package cz.opendatalab.egidio.backend.shared.tokens.checker

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import org.springframework.stereotype.Component

@Component
interface ExpiringTokenChecker<T> {
    fun checks(token: EmbeddableExpiringToken<T>, value: T) : Boolean
}