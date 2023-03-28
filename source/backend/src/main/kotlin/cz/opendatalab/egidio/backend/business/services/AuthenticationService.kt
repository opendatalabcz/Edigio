package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.user.User

interface AuthenticationService {
    val currentLoggedInUser: User
}