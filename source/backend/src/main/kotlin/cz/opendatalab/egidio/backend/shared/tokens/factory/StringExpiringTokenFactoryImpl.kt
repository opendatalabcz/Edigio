package cz.opendatalab.egidio.backend.shared.tokens.factory

import cz.opendatalab.egidio.backend.business.custom_component_types.Factory
import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import cz.opendatalab.egidio.backend.shared.date_time.plus
import cz.opendatalab.egidio.backend.shared.hasher.Hasher
import cz.opendatalab.egidio.backend.shared.tokens.ExpiringTokenWithRawValue
import java.security.SecureRandom
import java.time.Clock
import java.time.LocalDateTime
import java.util.*
import kotlin.time.Duration

@Factory
class StringExpiringTokenFactoryImpl(
    val hasher : Hasher<String>,
    val clock : Clock
) : StringExpiringTokenFactory {
    val rng = SecureRandom.getInstance(PRNG_ALGORITHM, PRNG_PROVIDER)
    override fun createWithRawValueIncluded(
        validityDuration : Duration?,
        onIssue : (rawToken : String) -> Unit
    ) : ExpiringTokenWithRawValue<String> {
        return ByteArray(VALUE_LENGTH)
            .apply { rng.nextBytes(this) }
            .let {
                val rawToken : String = HexFormat.of().formatHex(it)
                val token = EmbeddableExpiringToken(
                    token = hasher.hash(rawToken),
                    expiresAt = validityDuration?.let { duration -> LocalDateTime.now(clock) + duration }
                )
                onIssue(rawToken)
                ExpiringTokenWithRawValue(
                    rawValue = rawToken,
                    token = token
                )
            }
    }

    override fun create(
        validityDuration : Duration?,
        onIssue : (rawToken : String) -> Unit
    ) : EmbeddableExpiringToken<String> = createWithRawValueIncluded(validityDuration, onIssue).token

    companion object {
        const val VALUE_LENGTH = 256
        const val PRNG_ALGORITHM = "SHA1PRNG"
        const val PRNG_PROVIDER = "SUN"
    }
}