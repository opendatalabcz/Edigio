package cz.opendatalab.egidio.backend.shared.converters.user

import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.LoggedUserInfo
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.LoggedUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto

interface UserConverter {
    fun publicInfoToPublicInfoDto(publicUserInfo : PublicUserInfo) : PublicUserInfoDto
    fun userToPublicUserInfo(user : User) : PublicUserInfo
    fun userToLoggedUserInfo(user : User) : LoggedUserInfo
    fun loggedUserInfoToLoggedUserInfoDto(loggedUserInfo : LoggedUserInfo) : LoggedUserInfoDto
    fun publishedContactDetailSettingsDtoToSettings(
        dto : PublishedContactDetailSettingsDto
    ) : PublishedContactDetailSettings

    fun publishedContactDetailSettingsUpdateDtoToSettings(
        originalSettings: PublishedContactDetailSettings,
        updateDto : PublishedContactDetailSettingsUpdateDto
    ) : PublishedContactDetailSettings
}