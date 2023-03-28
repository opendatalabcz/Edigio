package cz.opendatalab.egidio.backend

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Clock

@Configuration
class DateTimeConfiguration {
    /**
     * Clock to be used
     */
    @get:Bean
    val clock: Clock = Clock.systemUTC()
}