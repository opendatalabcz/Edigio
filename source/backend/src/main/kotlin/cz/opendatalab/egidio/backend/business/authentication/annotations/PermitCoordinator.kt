package cz.opendatalab.egidio.backend.business.authentication.annotations

import org.springframework.security.access.prepost.PreAuthorize

@PreAuthorize("hasAnyAuthority('COORDINATOR','ADMIN')")
annotation class PermitCoordinator()
