import {AdvertisementType} from "../../models/advertisement/advertisement";
import {requireValidAdvertisementType} from "./advertisement-assertions";

describe('advertisement-assertions', () => {
  it("requireValidAdvertisementType doesn't throw for OFFER value", () => {
    expect(requireValidAdvertisementType(AdvertisementType.OFFER)).toBe(AdvertisementType.OFFER)
  })

  it("requireValidAdvertisementType doesn't throw for REQUEST value", () => {
    expect(requireValidAdvertisementType(AdvertisementType.REQUEST)).toBe(AdvertisementType.REQUEST)
  })

  it("requireValidAdvertisementType doesn't throw for 'offer' string", () => {
    expect(requireValidAdvertisementType('offer')).toBe(AdvertisementType.OFFER)
  })

  it("requireValidAdvertisementType doesn't throw for 'request' string", () => {
    expect(requireValidAdvertisementType('request')).toBe(AdvertisementType.REQUEST)
  })

  it("requireValidAdvertisementType throws for 'reques' string (missing 't')", () => {
    expect(() => requireValidAdvertisementType('reques')).toThrowError()
  })

  it("requireValidAdvertisementType throws for 'ofer' string (missing 'f')", () => {
    expect(() => requireValidAdvertisementType('ofer')).toThrowError()
  })
})
