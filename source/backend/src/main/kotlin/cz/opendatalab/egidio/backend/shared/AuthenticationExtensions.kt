package cz.opendatalab.egidio.backend.shared

import cz.opendatalab.egidio.backend.business.entities.user.Role
import org.springframework.security.core.Authentication

fun Authentication.isAdmin() = isAuthenticated && authorities.any { it.authority == Role.ADMIN.name }

val Authentication.isAtLeastCoordinator: Boolean
    inline get() = isAuthenticated && authorities.any { it.authority in setOf(Role.ADMIN.name, Role.COORDINATOR.name)}
