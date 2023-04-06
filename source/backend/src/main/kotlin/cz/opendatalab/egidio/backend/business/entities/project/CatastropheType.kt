package cz.opendatalab.egidio.backend.business.entities.project

import com.fasterxml.jackson.annotation.JsonValue

/**
 * Available types of catastrophes
 */
enum class CatastropheType(@field:JsonValue() val value: String) {
    DROUGHT(value = "drought"),
    HIGH_TEMPERATURES(value = "high_temperatures"),
    WIND(value = "wind"),
    HEAVY_RAINFALL(value = "heavy_rainfall"),
    FLOODING(value = "flooding"),
    FOOD_AND_WATER_OUTAGE(value = "food_and_water_outage"),
    BIOTIC_EMERGENCY(value = "biotic_emergency"),
    CHEMICAL_EMERGENCY(value = "chemical_emergency"),
    ENERGY_OUTAGE(value = "energy_outage"),
    MIGRATION(value = "migration"),
    CRIMINALITY(value = "criminality"),
    OTHER(value = "other"),
}