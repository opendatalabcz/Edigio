package cz.opendatalab.egidio.backend.configs

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor

@Configuration
class ExceptionsRelatedConfiguration {
    @Bean
    fun persistenceExceptionTranslator() : PersistenceExceptionTranslationPostProcessor {
        //Setup translation of exceptions,
        // so exceptions defined by Spring are used instead of plain exceptions used by ORMs and other persistent tools
        return PersistenceExceptionTranslationPostProcessor()
    }
}