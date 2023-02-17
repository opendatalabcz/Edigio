import {AdvertisementType} from "../../models/advertisement/advertisement";
import {createAppendedErrorDescriptionString} from "./common-assertions";

export function requireValidAdvertisementType(subj: string | AdvertisementType,
                                              description?: string): AdvertisementType {
  const value = subj as AdvertisementType
  if (!Object.values(AdvertisementType).includes(value)) {
    throw new Error(
      `"${value.toString()}" is not valid advertisement type!${createAppendedErrorDescriptionString(description)}`
    )
  }
  return value;
}
