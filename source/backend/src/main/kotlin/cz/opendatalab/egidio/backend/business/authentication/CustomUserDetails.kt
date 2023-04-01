package cz.opendatalab.egidio.backend.business.authentication

import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.business.entities.user.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUserDetails(
    val role: Role,
    private val password: String,
    private val usernameOrEmail: String,
    private val locked: Boolean,
    private val registered: Boolean,
    private val emailConfirmed: Boolean
) : UserDetails {
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableSetOf(SimpleGrantedAuthority(role.name))
    }

    override fun getPassword(): String = password
    override fun getUsername(): String = usernameOrEmail

    override fun isAccountNonExpired(): Boolean = true // Right now we have no mechanism for credentials to expire

    override fun isAccountNonLocked(): Boolean = !locked

    override fun isCredentialsNonExpired(): Boolean = true // Right now we have no mechanism for credentials to expire

    override fun isEnabled(): Boolean = registered && emailConfirmed
}