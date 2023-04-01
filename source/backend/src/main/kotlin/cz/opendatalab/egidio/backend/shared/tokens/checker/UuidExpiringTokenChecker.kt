package cz.opendatalab.egidio.backend.shared.tokens.checker

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.LocalDateTime
import java.util.*

@Component
class UuidExpiringTokenChecker(val clock: Clock) : ExpiringTokenChecker<UUID> {
    private fun tokenExpired(token: EmbeddableExpiringToken<UUID>) =
        token.expiresAt?.isBefore(LocalDateTime.now(clock)) == true

    override fun checks(token: EmbeddableExpiringToken<UUID>, value: UUID): Boolean =
        !tokenExpired(token) && token.token == value
}