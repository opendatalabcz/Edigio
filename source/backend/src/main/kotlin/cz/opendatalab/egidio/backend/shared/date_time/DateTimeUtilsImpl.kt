package cz.opendatalab.egidio.backend.shared.date_time

import cz.opendatalab.egidio.backend.business.custom_component_types.UtilityComponent
import org.springframework.stereotype.Component
import java.time.*

@UtilityComponent
class DateTimeUtilsImpl : DateTimeUtils {
    override fun utcLocalDateTimeNow(): LocalDateTime {
        return LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
    }

    override fun localDateTimeNow(): LocalDateTime {
        return LocalDateTime.now()
    }
}