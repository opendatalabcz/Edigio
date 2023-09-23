package cz.opendatalab.egidio.backend.shared.uuid

import java.util.*

/**
 * Provider for UUIDs
 */
fun interface UuidProvider {
    /**
     * Retrieve next UUID
     */
    fun getNext(): UUID
}