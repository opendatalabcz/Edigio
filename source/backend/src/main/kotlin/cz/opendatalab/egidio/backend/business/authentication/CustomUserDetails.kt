package cz.opendatalab.egidio.backend.business.authentication

import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(val user: User) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableSetOf(SimpleGrantedAuthority(user.role.name))
    }

    override fun getPassword(): String = requireNotNull(user.password)
    override fun getUsername(): String = user.username ?: user.email

    override fun isAccountNonExpired(): Boolean = true // Right now we have no mechanism for credentials to expire

    override fun isAccountNonLocked(): Boolean = false

    override fun isCredentialsNonExpired(): Boolean = true // Right now we have no mechanism for credentials to expire

    override fun isEnabled(): Boolean = user.registered && user.emailConfirmed
}