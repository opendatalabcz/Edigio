package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.authentication.CustomUserDetails
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.LoggedUserInfo
import cz.opendatalab.egidio.backend.persistence.repositories.UserRepository
import cz.opendatalab.egidio.backend.shared.converters.user.UserConverter
import org.springframework.security.authentication.AnonymousAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AuthenticationServiceImpl(
    val userRepository : UserRepository,
    val userConverter : UserConverter
) : AuthenticationService {
    override val isUserAuthenticated : Boolean
        get() = SecurityContextHolder.getContext().authentication.let {
            it !is AnonymousAuthenticationToken && it.isAuthenticated
        }

    override val currentLoggedInUser : User?
        get() {
            return if (isUserAuthenticated) SecurityContextHolder.getContext().authentication.principal.let {
                if (it is CustomUserDetails) {
                    userRepository.findByUsernameAndRegisteredIsTrue(it.username)
                } else {
                    throw IllegalStateException("Unknown authentication principal!")
                }
            } else null
        }

    override fun currentLoggedUserInfo() : LoggedUserInfo? {
        return this.currentLoggedInUser?.let(userConverter::userToLoggedUserInfo)
    }

    override fun requireLoggedInUser() : User = requireNotNull(currentLoggedInUser)
}