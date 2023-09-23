package cz.opendatalab.egidio.backend.shared.uuid

import cz.opendatalab.egidio.backend.business.custom_component_types.Provider
import java.util.*

/**
 * Provider for random UUIDs based on [UUID] class methods
 */
@Provider
class UuidProviderImpl : UuidProvider {
    override fun getNext(): UUID {
        return UUID.randomUUID()
    }
}