/**
 * Available types of catastrophes for projects
 *
 * It's not expected to add or remove types that often.
 * Therefore I decided to simple use enum instead of database record.
 * Should this fact change (don't think it will), it would be wiser to pull it up to database as an application entity,
 * and retrieve it from there.
 *
 */
export enum CatastropheType {
  DROUGHT = 'drought',
  HIGH_TEMPERATURES = 'high_temperatures',
  WIND = 'wind',
  HEAVY_RAINFALL = 'heavy_rainfall',
  FLOODING = 'flooding',
  FOOD_AND_WATER_OUTAGE = 'food_and_water_outage',
  BIOTIC_EMERGENCY = 'biotic_emergency',
  CHEMICAL_EMERGENCY = 'chemical_emergency',
  ENERGY_OUTAGE = 'energy_outage',
  MIGRATION = 'migration',
  CRIMINALITY = 'criminality',
  OTHER = 'other',
}
