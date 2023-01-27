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
  FLOODING="flooding", WAR="war", FIRE="fire", HURRICANE="hurricane", OTHER="other"
}
