package cz.opendatalab.egidio.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity

@EnableWebSecurity
@SpringBootApplication
class EgidioApplication

fun main(args: Array<String>) {
	runApplication<EgidioApplication>(*args)
}
