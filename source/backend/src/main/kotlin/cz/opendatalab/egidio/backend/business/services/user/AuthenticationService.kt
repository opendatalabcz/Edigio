package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.LoggedUserInfo

interface AuthenticationService {
    val isUserAuthenticated: Boolean
    val currentLoggedInUser: User?
    val isAtLeastCoordinatorLoggedIn
        get() = currentLoggedInUser?.isAtLeastCoordinator == true

    fun requireLoggedInUser(): User
    fun currentLoggedUserInfo() : LoggedUserInfo?
}