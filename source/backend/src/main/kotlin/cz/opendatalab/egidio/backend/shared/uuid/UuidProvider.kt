package cz.opendatalab.egidio.backend.shared.uuid

import java.util.*

interface UuidProvider {
    fun getNext(): UUID
}