package cz.opendatalab.egidio.backend.data.resource

import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.resource.Resource
import cz.opendatalab.egidio.backend.data.language.TestLanguage.Companion.CZECH
import cz.opendatalab.egidio.backend.data.language.TestLanguage.Companion.ENGLISH

class TestResource {
    companion object {
        val BOTTLED_WATER_RESOURCE = Resource(
            name = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Balená voda",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Bottled water",
                        language = ENGLISH
                    ),
                )
            ),
            description = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Balená voda ve flašce, plechovce...",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Bottled water in bottle, tin...",
                        language = ENGLISH
                    ),
                )
            ),
            slug = "20230406160228798-balena-voda",
            id = 1
        )
        val CARGO_VAN_RESOURCE = Resource(
            name = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Nákladní dodávka",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Cargo van",
                        language = ENGLISH
                    ),
                )
            ),
            description = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Dodávka používaná pro převoz materiálu",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Van used to transport material",
                        language = ENGLISH
                    ),
                )
            ),
            slug = "20230406160930798-nakladni-dodavka",
            id = 2
        )
        val VAN_DRIVER_RESOURCE = Resource(
            name = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Řidič dodávky",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Van driver",
                        language = ENGLISH
                    ),
                )
            ),
            description = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = mutableListOf(
                    LocalizedText(
                        text = "Někdo kdo může řídit dodávku.",
                        language = CZECH
                    ),
                    LocalizedText(
                        text = "Someone who can drive a van",
                        language = ENGLISH
                    ),
                )
            ),
            slug = "20230606160935798-nakladni-dodavka",
            id = 3
        )
    }
}