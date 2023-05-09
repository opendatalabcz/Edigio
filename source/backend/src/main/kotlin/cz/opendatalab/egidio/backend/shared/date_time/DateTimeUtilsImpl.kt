package cz.opendatalab.egidio.backend.shared.date_time

import cz.opendatalab.egidio.backend.business.custom_component_types.UtilityComponent
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset

@UtilityComponent
class DateTimeUtilsImpl : DateTimeUtils {
    override fun utcOffsetDateTimeNow() : OffsetDateTime {
        return OffsetDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
    }

    override fun OffsetDateTimeNow() : OffsetDateTime {
        return OffsetDateTime.now()
    }
}