package cz.opendatalab.egidio.backend.shared.tokens.checker

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.shared.hasher.Hasher
import org.springframework.stereotype.Component
import java.time.Clock
import java.time.LocalDateTime

@Component
class HashedStringExpiringTokenChecker(
    val clock: Clock,
    val stringTokenHasher: Hasher<String>
) : ExpiringTokenChecker<String> {
    override fun checks(token: EmbeddableExpiringToken<String>, value: String) : Boolean
    = (token.expiresAt?.isAfter(LocalDateTime.now(clock)) ?: true) && stringTokenHasher.hash(value) == token.token
}