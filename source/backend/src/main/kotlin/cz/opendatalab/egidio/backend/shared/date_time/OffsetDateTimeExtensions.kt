package cz.opendatalab.egidio.backend.shared.date_time

import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit
import kotlin.time.Duration

operator fun OffsetDateTime.plus(duration: Duration): OffsetDateTime = plus(duration.inWholeMilliseconds, ChronoUnit.MILLIS)