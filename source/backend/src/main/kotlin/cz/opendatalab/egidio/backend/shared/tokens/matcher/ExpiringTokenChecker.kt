package cz.opendatalab.egidio.backend.shared.tokens.matcher

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import org.springframework.stereotype.Component

@Component
interface ExpiringTokenChecker<T> {
    fun checks(token: EmbeddableExpiringToken<T>, value: T) : Boolean
}