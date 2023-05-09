package cz.opendatalab.egidio.backend.business.entities.embedables

import jakarta.persistence.Embeddable
import java.time.OffsetDateTime

@Embeddable
data class EmbeddableExpiringToken<T> (
    val token: T,
    val expiresAt: OffsetDateTime?
) {
    companion object {
        const val TOKEN_ATTRIBUTE_NAME = "token"
        const val EXPIRES_AT_ATTRIBUTE_NAME = "expiresAt"
    }
}