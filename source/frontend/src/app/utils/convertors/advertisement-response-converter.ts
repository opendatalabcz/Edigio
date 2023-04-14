import {Injectable} from "@angular/core";
import {
  AdvertisementResponseCreateData,
  AdvertisementResponsePreview
} from "../../models/advertisement/advertisement-response";
import {AdvertisementResponseCreationDto, AdvertisementResponsePreviewDto} from "../../dto/advertisement-response";
import {ResponseItemConverter} from "./response-item-converter";
import {UserConverter} from "./user-converter";
import {AdvertisementConverter} from "./advertisement-converter";
import {ApiDateTimeConverter} from "./api-date-time-converter";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";

@Injectable({
  providedIn: 'root'
})
export class AdvertisementResponseConverter {
  constructor(
    private responseItemConverter: ResponseItemConverter,
    private userConverter: UserConverter,
    private advertisementConverter: AdvertisementConverter,
    private dateTimeConverter: ApiDateTimeConverter
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

  previewDtoToPreviewModel(dto: AdvertisementResponsePreviewDto): AdvertisementResponsePreview {
    return {
      id: dto.publicId,
      advertisement: this.advertisementConverter.inResponseAdvertisementDtoToInResponseAdvertisement(dto.advertisement),
      listedItems: dto.listedItems.map((itemDto) => this.responseItemConverter.dtoToModel(itemDto)),
      responderNote: dto.responderNote,
      responder: this.userConverter.publicUserInfoDtoToUserModel(dto.responder),
      status: dto.status,
      resolvableByUser: dto.resolvableByUser,
      resolvableByToken: dto.resolvableByToken,
      createdAt: this.dateTimeConverter.stringToDate(dto.createdAt),
      resolvedAt: isObjectNotNullOrUndefined(dto.resolvedAt)
        ? this.dateTimeConverter.stringToDate(dto.resolvedAt) : undefined
    }
  }
}
