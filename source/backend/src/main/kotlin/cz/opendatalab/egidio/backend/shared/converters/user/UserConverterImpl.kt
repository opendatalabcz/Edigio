package cz.opendatalab.egidio.backend.shared.converters.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.LoggedUserInfo
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.LoggedUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
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

    override fun userToPublicUserInfo(user : User) : PublicUserInfo = PublicUserInfo(
        username = user.username.takeIf { user.registered },
        firstname = user.firstname.takeIf { user.publishedContactDetailSettings.firstname },
        lastname = user.lastname.takeIf { user.publishedContactDetailSettings.lastname },
        email = user.email.takeIf { user.publishedContactDetailSettings.email },
        telephoneNumber = user.phoneNumber.takeIf { user.publishedContactDetailSettings.telephoneNumber },
        spokenLanguages = user.spokenLanguages
    )

    override fun publishedContactDetailSettingsDtoToSettings(
        dto : PublishedContactDetailSettingsDto
    ) = PublishedContactDetailSettings(
        firstname = dto.firstname,
        lastname = dto.lastname,
        email = dto.email,
        telephoneNumber = dto.telephoneNumber
    )

    override fun publishedContactDetailSettingsUpdateDtoToSettings(
        originalSettings : PublishedContactDetailSettings,
        updateDto : PublishedContactDetailSettingsUpdateDto
    ) : PublishedContactDetailSettings = PublishedContactDetailSettings(
        firstname = originalSettings.firstname,
        lastname = updateDto.lastname,
        email = updateDto.email,
        telephoneNumber = updateDto.telephoneNumber
    )

    override fun userToLoggedUserInfo(user : User) : LoggedUserInfo = LoggedUserInfo(
        publicId = user.publicId,
        username = requireNotNull(
            user.username,
            { "There shouldn't be a user who has null username and is registered" }),
        role = user.role
    )

    override fun loggedUserInfoToLoggedUserInfoDto(loggedUserInfo : LoggedUserInfo) : LoggedUserInfoDto =
        LoggedUserInfoDto(
            publicId = loggedUserInfo.publicId,
            username = loggedUserInfo.username,
            role = loggedUserInfo.role
        )
}