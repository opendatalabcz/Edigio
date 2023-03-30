package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User

interface AuthenticationService {
    val currentLoggedInUser: User
    fun changeUser(user: User)
}