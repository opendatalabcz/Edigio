package cz.opendatalab.egidio.backend.shared.date_time

import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import kotlin.time.Duration

operator fun LocalDateTime.plus(duration: Duration): LocalDateTime = plus(duration.inWholeMilliseconds, ChronoUnit.MILLIS)