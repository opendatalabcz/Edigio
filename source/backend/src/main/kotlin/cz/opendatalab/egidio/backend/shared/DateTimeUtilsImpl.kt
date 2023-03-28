package cz.opendatalab.egidio.backend.shared

import org.springframework.stereotype.Component
import java.time.*

@Component
class DateTimeUtilsImpl : DateTimeUtils {
    override fun utcLocalDateTimeNow(): LocalDateTime {
        return LocalDateTime.ofInstant(Instant.now(), ZoneOffset.UTC)
    }

    override fun localDateTimeNow(): LocalDateTime {
        return LocalDateTime.now()
    }
}