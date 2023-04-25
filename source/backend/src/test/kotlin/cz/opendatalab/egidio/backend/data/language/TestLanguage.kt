package cz.opendatalab.egidio.backend.data.language

import cz.opendatalab.egidio.backend.business.entities.localization.Language

class TestLanguage private constructor() {
    companion object {
        val languages = listOf(
            Language(
                code = "cs",
                allowedForMultilingualTexts = true,
                version = 1,
                id = 1
            ),
            Language(
                code = "en",
                allowedForMultilingualTexts = true,
                version = 1,
                id = 2
            ),
            Language(
                code = "de",
                allowedForMultilingualTexts = false,
                version = 1,
                id = 3
            ),
            Language(
                code = "es",
                allowedForMultilingualTexts = false,
                version = 1,
                id = 4
            ),
            Language(
                code = "it",
                allowedForMultilingualTexts = false,
                version = 1,
                id = 5
            )
        )

        val allTestLanguages : List<Language>
            get() = languages
    }
}