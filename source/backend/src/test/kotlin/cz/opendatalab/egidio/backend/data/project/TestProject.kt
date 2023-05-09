package cz.opendatalab.egidio.backend.data.project

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.business.entities.project.Project
import cz.opendatalab.egidio.backend.business.entities.project.ProjectStatus
import cz.opendatalab.egidio.backend.data.important_information.TestImportantInformation
import cz.opendatalab.egidio.backend.data.language.TestLanguage
import cz.opendatalab.egidio.backend.data.user.TestUser
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset

class TestProject {
    companion object {
        val UKRAINE = Project(
            title = MultilingualText(
                defaultTextLanguage = TestLanguage.CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Válka na ukrajině",
                        language = TestLanguage.CZECH
                    ),
                    LocalizedText(
                        text = "War in Ukraine",
                        language = TestLanguage.ENGLISH
                    )
                ),
                version = 1,
                id = 1
            ),
            description = MultilingualText(
                defaultTextLanguage = TestLanguage.CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Válka na ukrajině, která začala v březnu 2022",
                        language = TestLanguage.CZECH
                    ),
                    LocalizedText(
                        text = "War in Ukraine that began in March 2022",
                        language = TestLanguage.ENGLISH
                    )
                ),
                version = 1,
                id = 1
            ),
            catastropheType = CatastropheType.MIGRATION,
            advertisements = mutableListOf(),
            importantInformation = mutableListOf(
                TestImportantInformation.SEZNAM_CZ
            ),
            createdAt = OffsetDateTime.of(LocalDateTime.of(2023, 3, 4, 7, 6, 5), ZoneOffset.UTC),
            createdBy = TestUser.MR_ADMIN,
            updatedAt = null,
            updatedBy = null,
            publishedAt = OffsetDateTime.of(LocalDateTime.of(2023, 1, 12, 7, 6, 5), ZoneOffset.UTC),
            publishedBy = TestUser.MR_ADMIN,
            archivedAt = null,
            archivedBy = null,
            slug = "20230304070605123-valka-na-ukrajine",
            status = ProjectStatus.PUBLISHED,
            id = null
        )
    }
}