package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.authentication.CustomUserDetails
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.stereotype.Service

@Service
class UserDetailsServiceImpl(
    val userService: UserService
) : UserDetailsService {
    override fun loadUserByUsername(username: String?): UserDetails {
        val nonNullUsername = requireNotNull(username, { "Cannot retrieve user with null username!" })
        val user = userService.getRegisteredUserByUsername(nonNullUsername)
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