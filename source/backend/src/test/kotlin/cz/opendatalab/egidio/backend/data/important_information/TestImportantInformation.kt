package cz.opendatalab.egidio.backend.data.important_information

import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformation
import cz.opendatalab.egidio.backend.business.entities.important_information.ImportantInformationLink
import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.data.language.TestLanguage
import java.net.URL

class TestImportantInformation {
    companion object {
        val SEZNAM_CZ = ImportantInformation(
            title = MultilingualText(
                defaultTextLanguage = TestLanguage.CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "seznam.cz",
                        language = TestLanguage.CZECH
                    ),
                ),
                version = 1,
                id = 1
            ),
            text = MultilingualText(
                defaultTextLanguage = TestLanguage.CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Seznam, najdu tam, co neznám!",
                        language = TestLanguage.CZECH
                    ),
                    LocalizedText(
                        text = "Seznam, i will find there whatever I want!",
                        language = TestLanguage.ENGLISH
                    )
                ),
                version = 1,
                id = 1
            ),
            links = listOf(
                ImportantInformationLink(
                    MultilingualText(
                        defaultTextLanguage = TestLanguage.CZECH,
                        texts = ArrayList(
                            listOf(
                                LocalizedText("Hlavní stránka", TestLanguage.CZECH),
                                LocalizedText("Main page", TestLanguage.ENGLISH)
                            )
                        ),
                        version = 1,
                        id = 1
                    ),
                    location = URL("https://www.seznam.cz")
                )
            ),
            version = 1,
            slug = "20230102030405111-seznam-cz",
            id = 1
        )
    }
}