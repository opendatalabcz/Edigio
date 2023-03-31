package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.authentication.CustomUserDetails
import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AuthenticationServiceImpl : AuthenticationService {
    override val isUserAuthenticated: Boolean
        get() = SecurityContextHolder.getContext().authentication.let {
            it !is AnonymousAuthenticationToken && it.isAuthenticated
        }

    override val currentLoggedInUser: User?
        get() {
            return if (isUserAuthenticated) SecurityContextHolder.getContext().authentication.principal.let {
                println(it)
                if (it is CustomUserDetails) {
                    it.user
                } else {
                    throw IllegalStateException("Unknown authentication principal!")
                }
            } else null
        }

    override fun requireLoggedInUser(): User = requireNotNull(currentLoggedInUser)

    override fun changeUser(user: User) {
        TODO("Not yet implemented")
    }
}