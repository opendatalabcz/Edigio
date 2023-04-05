package cz.opendatalab.egidio.backend.shared.tokens.checker

import cz.opendatalab.egidio.backend.business.entities.embedables.EmbeddableExpiringToken
import org.springframework.stereotype.Component

@Component
interface ExpiringTokenChecker<T> {
    /**
     * Finds out whether token is still usable (not expired) and whether value is valid for the token
     *
     * @param token against which [value] should be checked
     * @param value token value to be checked
     *
     * @return *true* when token is not expired yet and value is usable for token, false otherwise
     */
    fun checks(token: EmbeddableExpiringToken<T>, value: T) : Boolean

    /**
     * Checks whether nullable [value] is not null and [checks] yields true for given arguments
     *
     * As token is not nullable, it means that a value is expected for [token].
     * When no value is given, it means it cannot be valid for the [token].
     *
     *
     * @see [checks] for more info
     */
    fun nullableValueChecks(token: EmbeddableExpiringToken<T>, value: T?)
    = value != null && checks(token, value)

    /**
     * Checks whether nullable [token] is not null and [nullableValueChecks] yields true for given arguments
     *
     * When no token is given, it means that no value can validate against it.
     *
     * @see [nullableValueChecks] for more info
     */
    fun nullableTokenAndValueChecks(token: EmbeddableExpiringToken<T>?, value: T?)
    = token != null && nullableValueChecks(token, value)
}