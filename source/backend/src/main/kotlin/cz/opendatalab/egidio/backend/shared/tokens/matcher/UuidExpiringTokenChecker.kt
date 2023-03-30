package cz.opendatalab.egidio.backend.shared.tokens.matcher

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import java.time.Clock
import java.time.LocalDateTime
import java.util.UUID

class UuidExpiringTokenChecker(val clock: Clock) : ExpiringTokenChecker<UUID> {
    override fun checks(token: EmbeddableExpiringToken<UUID>, value: UUID): Boolean
    = token.expiresAt?.isAfter(LocalDateTime.now(clock)) == true && token.token == value
}