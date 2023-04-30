package cz.opendatalab.egidio.backend.business.authentication.annotations

import org.springframework.security.access.prepost.PreAuthorize

/**
 * Security annotation that allow access to users who have at least COORDINATOR role
 */
@PreAuthorize("hasAnyAuthority('COORDINATOR','ADMIN')")
annotation class PermitCoordinator()
