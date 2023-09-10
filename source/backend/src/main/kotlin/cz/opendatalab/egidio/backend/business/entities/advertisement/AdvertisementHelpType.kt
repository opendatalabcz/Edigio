package cz.opendatalab.egidio.backend.business.entities.advertisement

import com.fasterxml.jackson.annotation.JsonValue

/**
 * Type of help offerable / requestable by an [Advertisement]
 */
enum class AdvertisementHelpType(@field:JsonValue val value: String) {
    //Offers/request for a place to stay
    ACCOMMODATIONS("accomodations"),

    //The most general type of material help
    //Should be used when no other kind of material help is suitable
    //It also should be used when help contains more than one kind of material
    MATERIAL("material"),

    //Equipment used during response to emergency.
    FOOD_AND_WATER("food_and_water"),

    //Example given: fire extinguisher, drone, bulldozers, cranes, radios...
    EMERGENCY_RESPONSE_EQUIPMENT("emergency_response_equipment"),

    //All kind of drugs, medical equipment (although it some of these would fit category above, I would like it to be there)
    MEDICAL_SUPPLIES("medical_supplies"),

    //When someone offers to help
    VOLUNTEERING("volunteering"),

    //Help of people that are specialist in their expertise,
    // and are not suitable for other specialized categories
    SPECIALIST("specialist"),

    //Someone who can help with craft activity (repair roof, wall etc.)
    CRAFTSMAN("craftsman"),

    //Type of help which would be chosen when someone wants to offer/request car, driver capabilities or both
    RIDE("ride"),

    //Doctors, nurses, paramedical, ... who can offer help (mostly) during their free time
    MEDICAL_ASSISTANCE("medical_assistance"),

    //People who can offer psychological assistance to people
    PSYCHOLOGICAL_HELP("psychological_help"),

    //Help with administration during disaster (filling papers, talking with office guys...)
    ADMINISTRATION("administration"),

    //Type of help that isn't specifically listed
    OTHER("other")
}

