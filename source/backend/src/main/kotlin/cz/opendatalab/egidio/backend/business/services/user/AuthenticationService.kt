package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User

interface AuthenticationService {
    val isUserAuthenticated: Boolean
    val currentLoggedInUser: User?
    val isAtLeastCoordinatorLoggedIn
        get() = currentLoggedInUser?.isAtLeastCoordinator == true

    fun requireLoggedInUser(): User
    fun changeUser(user: User)
}