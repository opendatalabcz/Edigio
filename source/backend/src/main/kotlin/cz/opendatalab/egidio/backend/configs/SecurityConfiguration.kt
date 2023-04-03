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
import org.springframework.security.web.savedrequest.NullRequestCache
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfiguration {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { authorize ->
                authorize.anyRequest().permitAll()
            }
            .formLogin()
            .loginProcessingUrl("/auth/login")
            .usernameParameter("username")
            .passwordParameter("password")
            .defaultSuccessUrl("/", true)
            .and()
            .requestCache()
            .requestCache(NullRequestCache())
            .and()
            .logout()
            .logoutUrl("/auth/logout")
            .and()
            .csrf().disable()
            .cors()
            .and()
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
    fun corsMapping(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:4200")
            }
        }
    }

    @Bean()
    fun passwordEncoder(): PasswordEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8()

    @Bean
    fun stringTokenHasher(): Hasher<String> = StringHasher()
}