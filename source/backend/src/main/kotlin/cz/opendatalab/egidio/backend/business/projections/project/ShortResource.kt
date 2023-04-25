package cz.opendatalab.egidio.backend.business.projections.project

import cz.opendatalab.egidio.backend.business.entities.localization.MultilingualText

interface ShortResource {
    val slug : String
    val name : MultilingualText
    val amount : Int
}