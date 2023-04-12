package cz.opendatalab.egidio.backend

import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.transaction.annotation.EnableTransactionManagement

@SpringBootApplication
@EnableTransactionManagement
class EgidioApplication

fun main(args: Array<String>) {
    runApplication<EgidioApplication>(*args)
}
