package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto


interface UserService {
    fun getUserById(id: Long): User
    fun createAnonymousUser(anonymousUserInfoCreateDto: AnonymousUserInfoCreateDto) : User
}