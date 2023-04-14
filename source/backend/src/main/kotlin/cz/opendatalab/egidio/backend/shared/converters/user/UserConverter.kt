package cz.opendatalab.egidio.backend.shared.converters.user

import cz.opendatalab.egidio.backend.business.entities.user.User
import cz.opendatalab.egidio.backend.business.projections.project.PublicUserInfo
import cz.opendatalab.egidio.backend.presentation.dto.user.PublicUserInfoDto

interface UserConverter {
    fun publicInfoToPublicInfoDto(publicUserInfo : PublicUserInfo): PublicUserInfoDto
    fun userToPublicUserInfo(user : User) : PublicUserInfo
}