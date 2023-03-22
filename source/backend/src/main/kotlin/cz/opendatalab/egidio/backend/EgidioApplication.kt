package cz.opendatalab.egidio.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class EgidioApplication

fun main(args: Array<String>) {
	runApplication<EgidioApplication>(*args)
}
