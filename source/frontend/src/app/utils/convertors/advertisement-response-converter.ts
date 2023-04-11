import {Injectable} from "@angular/core";
import {AdvertisementResponseCreateData} from "../../models/advertisement/advertisement-response";
import {AdvertisementResponseCreationDto} from "../../dto/advertisement-response";
import {ResponseItemConverter} from "./response-item-converter";
import {UserConverter} from "./user-converter";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementResponseConverter {
  constructor(
    private responseItemConverter: ResponseItemConverter,
    private userConverter: UserConverter
  ) {
  }

  createDataToCreateDto(data: AdvertisementResponseCreateData): AdvertisementResponseCreationDto {
    return {
      advertisementSlug: data.advertisementId,
      contact: data.contact,
      listedItems: data.listedItems.map((item) => {
        return this.responseItemConverter.creationDataToCreateDto(item)
      }),
      note: data.note
    }
  }
}
