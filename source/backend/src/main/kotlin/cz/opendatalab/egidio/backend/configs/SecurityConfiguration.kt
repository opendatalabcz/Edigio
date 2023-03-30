package cz.opendatalab.egidio.backend.configs

import cz.opendatalab.egidio.backend.shared.hasher.Hasher
import cz.opendatalab.egidio.backend.shared.hasher.StringHasher
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfiguration {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http.authorizeHttpRequests { authorize -> authorize.anyRequest().permitAll() }
        return http.build()
    }

    @Bean
    fun stringTokenHasher() : Hasher<String> = StringHasher()

    @Bean
    fun passwordHasher() : Hasher<String> = StringHasher()
}