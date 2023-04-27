package cz.opendatalab.egidio.backend.advertisement_template

import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementHelpType
import cz.opendatalab.egidio.backend.business.entities.advertisement.AdvertisementType
import cz.opendatalab.egidio.backend.business.entities.advertisement_template.AdvertisementTemplate
import cz.opendatalab.egidio.backend.business.entities.localization.LocalizedText
import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText
import cz.opendatalab.egidio.backend.business.entities.project.CatastropheType
import cz.opendatalab.egidio.backend.data.language.TestLanguage.Companion.CZECH
import cz.opendatalab.egidio.backend.data.language.TestLanguage.Companion.ENGLISH
import cz.opendatalab.egidio.backend.data.project.TestProject.Companion.UKRAINE
import cz.opendatalab.egidio.backend.data.resource.TestResource.Companion.CARGO_VAN_RESOURCE
import cz.opendatalab.egidio.backend.data.resource.TestResource.Companion.VAN_DRIVER_RESOURCE

class TestAdvertisementTemplate {
    companion object {
        val RIDE_TEMPLATE = AdvertisementTemplate(
            name = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = ArrayList(
                    listOf(
                        LocalizedText("Dodávka s řidičem", CZECH),
                        LocalizedText("Van with driver", ENGLISH)
                    )
                )
            ),
            description = MultilingualText(
                defaultTextLanguage = CZECH,
                texts = ArrayList(
                    listOf(
                        LocalizedText("Poskytnutí dodávky s řidičem pro přepravu materiálu.", CZECH),
                        LocalizedText("Providing a van with driver for transportation of material.", ENGLISH)
                    )
                )
            ),
            recommendedResources = mutableListOf(
                VAN_DRIVER_RESOURCE,
                CARGO_VAN_RESOURCE
            ),
            projects = mutableSetOf(UKRAINE),
            catastropheTypes = CatastropheType.values().toMutableSet(),
            advertisementTypes = AdvertisementType.values().toMutableSet(),
            helpTypes = AdvertisementHelpType.values().toMutableSet(),
            version = 1,
            slug = "20230102090909999-seznam-cz",
            id = 1
        )
    }
}