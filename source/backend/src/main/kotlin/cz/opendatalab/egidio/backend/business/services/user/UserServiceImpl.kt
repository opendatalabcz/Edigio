package cz.opendatalab.egidio.backend.business.services.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.exceptions.not_found.UserNotFoundException
import cz.opendatalab.egidio.backend.business.services.language.LanguageService
import cz.opendatalab.egidio.backend.persistence.repositories.UserRepository
import cz.opendatalab.egidio.backend.presentation.dto.user.AnonymousUserInfoCreateDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.shared.tokens.ExpiringTokenFactory
import org.springframework.stereotype.Service
import java.time.Clock
import java.time.LocalDateTime
import java.util.*


@Service
class UserServiceImpl(
    val userRepository: UserRepository,
    val languageService: LanguageService,
    val clock: Clock,
    val expiringTokenFactory: ExpiringTokenFactory<UUID>
) : UserService {
    override fun getUserById(id: Long): User {
        return userRepository.findById(id).orElseThrow { UserNotFoundException() }
    }

    override fun getRegisteredUserByUsername(username: String): User =
            userRepository.findByUsernameAndRegisteredTrue(username) ?: throw UserNotFoundException()

    private fun createPublishedContactDetailSettings(
        settingsDto: PublishedContactDetailSettingsDto
    ): PublishedContactDetailSettings = PublishedContactDetailSettings(
        firstname = settingsDto.firstname,
        lastname = settingsDto.lastname,
        email = settingsDto.email,
        telephoneNumber = settingsDto.telephoneNumber
    )

    override fun createAnonymousUser(createDto: AnonymousUserInfoCreateDto): User {
        return userRepository.save(
            User(
                username = null,
                firstname = createDto.contact.firstname,
                lastname = createDto.contact.lastname,
                email = createDto.contact.email,
                phoneNumber = createDto.contact.telephoneNumber,
                password = null,
                spokenLanguages = languageService
                    .getAllByCodes(createDto.spokenLanguagesCodes)
                    .toMutableList(),
                registeredAt = LocalDateTime.now(clock),
                emailConfirmationToken = expiringTokenFactory.create(validityDuration = null),
                registered = false,
                role = Role.ANONYMOUS_USER,
                locked = true,
                publishedContactDetailSettings = createPublishedContactDetailSettings(createDto.publishedContactDetail),
                emailConfirmed = false
            )
        )
    }
}