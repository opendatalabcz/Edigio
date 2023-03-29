package cz.opendatalab.egidio.backend.shared.date_time

import java.time.LocalDateTime

/**
 * Utilities meant for work with DateTime (mainly for its retrieval)
 *
 * Retrieval of current date time from plain Java/Kotlin classes (e.g. [LocalDateTime]) should be avoided,
 * as it makes the code untestable
 */
interface DateTimeUtils {
    fun utcLocalDateTimeNow() : LocalDateTime
    fun localDateTimeNow() : LocalDateTime
}