package cz.opendatalab.egidio.backend.configs

import cz.opendatalab.egidio.backend.shared.hasher.Hasher
import cz.opendatalab.egidio.backend.shared.hasher.StringHasher
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfiguration {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests {
                authorize -> authorize.anyRequest().permitAll()
            }
            .csrf().disable()
            .httpBasic()
        return http.build()
    }

    @Bean()
    fun daoAuthenticationProvider(
        passwordEncoder: PasswordEncoder,
        userDetailsService: UserDetailsService
    ): AuthenticationProvider {
        return DaoAuthenticationProvider()
            .apply {
                setPasswordEncoder(passwordEncoder)
                setUserDetailsService(userDetailsService)
            }
    }

    @Bean()
    fun passwordEncoder(): PasswordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()

    @Bean
    fun stringTokenHasher(): Hasher<String> = StringHasher()
}