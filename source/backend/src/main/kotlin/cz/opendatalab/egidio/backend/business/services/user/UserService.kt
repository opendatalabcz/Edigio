package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import jakarta.validation.Valid


interface UserService {
    /**
     * Get user by ID (either registered or non-registered)
     *
     * @throws UserNotFoundException when no registered user with given username is found
     */
    fun getUserById(id: Long): User
    /**
     * Get registered user by his username
     *
     * @throws UserNotFoundException when no registered user with given username is found
     */
    fun getRegisteredUserByUsername(@Valid username: String) : User

    /**
     * Create anonymous user
     */
    fun createAnonymousUser(createDto: AnonymousUserInfoCreateDto) : User
}