package cz.opendatalab.egidio.backend.data.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.Role
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.data.language.TestLanguage
import java.time.LocalDateTime
import java.util.*

class TestUser private constructor() {

    companion object {
        val USER_STREJDA_SKRBLIK = User(
            username = "kacer",
            firstname = "Strejda",
            lastname = "Skrblik",
            //Hash value of password=abcefg with salt=12345678
            //Generated online, so it might not be the same as value received from in-app hasher
            password = "\$argon2i\$v=19\$m=16,t=2,p=1\$MTIzNDU2Nzg\$OGDF5ClowIxOvu8nXqaV6w",
            phoneNumber = "123456789",
            email = "strejda@skrblik.kacerov",
            spokenLanguages = TestLanguage.allTestLanguages.toMutableList(),
            publishedContactDetailSettings = PublishedContactDetailSettings(
                firstname = true,
                lastname = true,
                email = true,
                telephoneNumber = true
            ),
            registered = true,
            registeredAt = LocalDateTime.of(1999, 1,2,3,4),
            emailConfirmed = true,
            emailConfirmationToken = null,
            role = Role.USER,
            publicId = UUID.fromString("13e11bb6-f45a-42b4-9e76-9efdab0f0ef1"),
            locked = false,
            id = 1
        )
        val MR_ADMIN = User(
            username = "mradmin",
            firstname = "Mister",
            lastname = "Admin",
            //Hash value of password=abcefg with salt=12345678
            //Generated online, so it might not be the same as value received from in-app hasher
            password = "\$argon2i\$v=19\$m=16,t=2,p=1\$MTIzNDU2Nzg\$OGDF5ClowIxOvu8nXqaV6w",
            phoneNumber = "123456789",
            email = "mister@admin.hoho",
            spokenLanguages = TestLanguage.allTestLanguages.toMutableList(),
            publishedContactDetailSettings = PublishedContactDetailSettings(
                firstname = true,
                lastname = true,
                email = true,
                telephoneNumber = true
            ),
            registered = true,
            registeredAt = LocalDateTime.of(2023, 1,2,3,4),
            emailConfirmed = true,
            emailConfirmationToken = null,
            role = Role.ADMIN,
            publicId = UUID.fromString("13e11bb6-f45a-42b4-9e76-9efdab0f0ef9"),
            locked = false,
            id = 2
        )
    }
}