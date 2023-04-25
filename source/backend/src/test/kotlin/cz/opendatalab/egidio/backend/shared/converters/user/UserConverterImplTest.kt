package cz.opendatalab.egidio.backend.shared.converters.user

import cz.opendatalab.egidio.backend.business.entities.localization.Language
import cz.opendatalab.egidio.backend.business.entities.user.PublishedContactDetailSettings
import cz.opendatalab.egidio.backend.data.user.TestUser
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsDto
import cz.opendatalab.egidio.backend.presentation.dto.user.PublishedContactDetailSettingsUpdateDto
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class UserConverterImplTest {

    val userConverter = UserConverterImpl()

    @Test
    fun publicInfoToPublicInfoDto() {
        val publicInfo = userConverter.userToPublicUserInfo(TestUser.USER_1)
        val actual = userConverter.publicInfoToPublicInfoDto(publicInfo)
        assertThat(actual)
            .usingRecursiveComparison()
            .ignoringFields("spokenLanguagesCodes")
            .isEqualTo(publicInfo)
        assertThat(publicInfo.spokenLanguages.map(Language::code))
            .containsExactlyInAnyOrderElementsOf(actual.spokenLanguagesCodes)
    }

    @Test
    fun userToPublicUserInfo() {
        val user = TestUser.USER_1
        val actual = userConverter.userToPublicUserInfo(user)
        assertThat(actual)
            .usingRecursiveComparison()
            .ignoringFields("telephoneNumber")
            .isEqualTo(user)
        assertThat(actual.telephoneNumber).isEqualTo(user.phoneNumber)
    }

    @Test
    fun publishedContactDetailSettingsDtoToSettings() {
        val dto = PublishedContactDetailSettingsDto(true, false, true, false)
        val actual = userConverter.publishedContactDetailSettingsDtoToSettings(dto)
        assertThat(dto)
            .usingRecursiveComparison()
            .isEqualTo(actual)
    }

    @Test
    fun publishedContactDetailSettingsToDto() {
        val detailSettings = TestUser.USER_1.publishedContactDetailSettings
        val actual = userConverter.publishedContactDetailSettingsToDto(detailSettings)
        assertThat(detailSettings)
            .usingRecursiveComparison()
            .isEqualTo(actual)
    }

    @Test
    fun publishedContactDetailSettingsUpdateDtoToSettings_true_false_true() {
        val originalSettings =
            PublishedContactDetailSettings(firstname = true, lastname = false, email = true, telephoneNumber = false)
        val updateDto = PublishedContactDetailSettingsUpdateDto(lastname = true, email = false, telephoneNumber = true)
        val actual = userConverter.publishedContactDetailSettingsUpdateDtoToSettings(originalSettings, updateDto)
        assertThat(updateDto)
            .usingRecursiveComparison()
            .ignoringFields("firstname")
            .isEqualTo(actual)
        assertThat(originalSettings.firstname).isEqualTo(actual.firstname)
    }

    @Test
    fun publishedContactDetailSettingsUpdateDtoToSettings_false_true_false() {
        val originalSettings =
            PublishedContactDetailSettings(firstname = false, lastname = true, email = false, telephoneNumber = true)
        val updateDto = PublishedContactDetailSettingsUpdateDto(lastname = false, email = true, telephoneNumber = false)
        val actual = userConverter.publishedContactDetailSettingsUpdateDtoToSettings(originalSettings, updateDto)
        assertThat(updateDto)
            .usingRecursiveComparison()
            .ignoringFields("firstname")
            .isEqualTo(actual)
        assertThat(originalSettings.firstname).isEqualTo(actual.firstname)
    }

    @Test
    fun userToLoggedUserInfo() {
        val user = TestUser.USER_1
        val actual = userConverter.userToLoggedUserInfo(user)
        assertThat(actual)
            .usingRecursiveComparison()
            .isEqualTo(user)
    }

    @Test
    fun loggedUserInfoToLoggedUserInfoDto() {
        val loggedUserInfo = userConverter.userToLoggedUserInfo(TestUser.USER_1)
        val actual = userConverter.loggedUserInfoToLoggedUserInfoDto(loggedUserInfo)
        assertThat(actual)
            .usingRecursiveComparison()
            .isEqualTo(loggedUserInfo)
    }

    @Test
    fun userToUserDto() {
    }
}