package cz.opendatalab.egidio.backend.configs

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.thymeleaf.spring6.SpringTemplateEngine
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver
import org.thymeleaf.templatemode.TemplateMode


@Configuration
class ThymeLeafConfiguration {
    @Bean
    fun springTemplateEngine(htmlTemplateResolver : SpringResourceTemplateResolver) : SpringTemplateEngine {
        val templateEngine = SpringTemplateEngine()
        templateEngine.addTemplateResolver(htmlTemplateResolver)
        return templateEngine
    }

    @Bean
    fun htmlTemplateResolver(@Value("\${egidio.email.encoding}") encoding: String) : SpringResourceTemplateResolver {
        return SpringResourceTemplateResolver().apply {
            prefix = "classpath:/templates/emails/"
            suffix = ".html"
            templateMode = TemplateMode.HTML
            characterEncoding = encoding
        }
    }
}