package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.authentication.CustomUserDetails
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    val userService: UserService
) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails {
        val nonNullUsername = requireNotNull(username, { "Cannot retrieve user with null username!" })
        val user: User
        try {
             user = userService.getRegisteredUserByUsername(nonNullUsername)
        } catch (ex: UserNotFoundException) {
            throw UsernameNotFoundException("Invalid login")
        }
        return CustomUserDetails(
            usernameOrEmail = user.username ?: user.email,
            password = requireNotNull( user.password ),
            role = user.role,
            locked = user.locked,
            registered = user.registered,
            emailConfirmed = user.emailConfirmed
        )
    }
}