package cz.opendatalab.egidio.backend.business.authentication.annotations

import org.springframework.security.access.prepost.PreAuthorize

@PreAuthorize("hasAnyRole('COORDINATOR,ADMIN')")
annotation class PermitCoordinator()
