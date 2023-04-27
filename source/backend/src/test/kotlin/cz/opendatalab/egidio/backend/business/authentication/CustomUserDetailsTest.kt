package cz.opendatalab.egidio.backend.business.authentication

import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.data.user.TestUser
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.springframework.security.core.authority.SimpleGrantedAuthority

class CustomUserDetailsTest {
    @Test
    fun testGetAuthorities() {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            user.role,
            requireNotNull(user.password),
            requireNotNull(user.username),
            user.locked,
            user.registered,
            user.emailConfirmed
        )
        assertThat(customUserDetails.authorities)
            .containsExactlyInAnyOrder(SimpleGrantedAuthority(user.role.toString()))
    }

    @Test
    fun testGetPassword() {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            user.role,
            requireNotNull(user.password),
            requireNotNull(user.username),
            user.locked,
            user.registered,
            user.emailConfirmed
        )
        assertEquals(user.password, customUserDetails.password)
    }

    @Test
    fun testGetUsername() {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            user.role,
            requireNotNull(user.password),
            requireNotNull(user.username),
            user.locked,
            user.registered,
            user.emailConfirmed
        )
        assertEquals(user.username, customUserDetails.username)
    }

    @Test
    fun testIsAccountNonExpired() {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            user.role,
            requireNotNull(user.password),
            requireNotNull(user.username),
            user.locked,
            user.registered,
            user.emailConfirmed
        )
        assertTrue(customUserDetails.isAccountNonExpired)
    }

    @ParameterizedTest
    @CsvSource(value = ["false, false, false", "false, true, false", "true, false, false", "true, true, true"])
    fun testIsEnabled(registered: Boolean, confirmed: Boolean, expected: Boolean) {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            Role.COORDINATOR,
            requireNotNull(user.password),
            requireNotNull(user.username),
            false,
            registered,
            confirmed
        )
        assertEquals(expected, customUserDetails.isEnabled)
    }

    @ParameterizedTest
    @CsvSource(value = ["false", "true"])
    fun testIsAccountNonLocked(locked: Boolean) {
        val user = TestUser.USER_STREJDA_SKRBLIK
        val customUserDetails = CustomUserDetails(
            Role.COORDINATOR,
            requireNotNull(user.password),
            requireNotNull(user.username),
            locked,
            true,
            true
        )
        assertEquals(!locked, customUserDetails.isAccountNonLocked)
    }
}