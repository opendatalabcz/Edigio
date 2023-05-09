package cz.opendatalab.egidio.backend.shared.date_time

import java.time.OffsetDateTime

/**
 * Utilities meant for work with DateTime (mainly for its retrieval)
 *
 * Retrieval of current date time from plain Java/Kotlin classes (e.g. [OffsetDateTime]) should be avoided,
 * as it makes the code untestable
 */
interface DateTimeUtils {
    fun utcOffsetDateTimeNow() : OffsetDateTime
    fun OffsetDateTimeNow() : OffsetDateTime
}