package cz.opendatalab.egidio.backend.business.services

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import org.springframework.stereotype.Service


@Service
class UserServiceImpl : UserService {
    override fun getUserById(id: Long): User {
        TODO("Not yet implemented")
    }

    override fun createAnonymousUser(anonymousUserInfoCreateDto: AnonymousUserInfoCreateDto): User {
        TODO("Not yet implemented")
    }
}