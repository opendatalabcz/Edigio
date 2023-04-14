package cz.opendatalab.egidio.backend.shared.converters.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import cz.opendatalab.egidio.backend.shared.annotations.custom_components.ConverterComponent

@ConverterComponent
class UserConverterImpl : UserConverter {
    override fun publicInfoToPublicInfoDto(publicUserInfo : PublicUserInfo) : PublicUserInfoDto {
        return PublicUserInfoDto(
            username = publicUserInfo.username,
            firstname = publicUserInfo.firstname,
            lastname = publicUserInfo.lastname,
            email = publicUserInfo.email,
            telephoneNumber = publicUserInfo.telephoneNumber,
            spokenLanguagesCodes = publicUserInfo.spokenLanguages.map { it.code }
        )
    }

    override fun userToPublicUserInfo(user: User) : PublicUserInfo
    = PublicUserInfo(
        username = user.username.takeIf { user.registered },
        firstname = user.firstname.takeIf { user.publishedContactDetailSettings.firstname },
        lastname = user.lastname.takeIf { user.publishedContactDetailSettings.lastname },
        email = user.email.takeIf { user.publishedContactDetailSettings.email },
        telephoneNumber = user.phoneNumber.takeIf { user.publishedContactDetailSettings.telephoneNumber },
        spokenLanguages = user.spokenLanguages
    )

}