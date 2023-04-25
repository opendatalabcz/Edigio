import {oppositeAdvertisementType} from "./advertisement-utils";
import {AdvertisementType} from "../models/advertisement/advertisement";

describe('advertisement-utils', () => {
  it('opposite advertisement type to REQUEST is OFFER', () => {
    expect(oppositeAdvertisementType(AdvertisementType.OFFER)).toBe(AdvertisementType.REQUEST)
  })

  it('opposite advertisement type to OFFER is REQUEST', () => {
    expect(oppositeAdvertisementType(AdvertisementType.REQUEST)).toBe(AdvertisementType.OFFER)
  })
})
