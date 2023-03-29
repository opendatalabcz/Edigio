package cz.opendatalab.egidio.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.transaction.annotation.EnableTransactionManagement

@EnableWebSecurity
@SpringBootApplication
@EnableTransactionManagement
class EgidioApplication

fun main(args: Array<String>) {
	runApplication<EgidioApplication>(*args)
}
