import {Injectable} from "@angular/core";
import {ResourceConverter} from "./resource-converter";
import {ResponseItem, ResponseItemCreationData} from "../../models/advertisement/response-item";
import {ResponseItemCreateDto, ResponseItemDto} from "../../dto/response-item";

@Injectable({
  providedIn: 'root'
})
export class ResponseItemConverter {
  constructor(
    private resourceConverter: ResourceConverter
  ) {
  }

  public creationDataToCreateDto(model: ResponseItemCreationData): ResponseItemCreateDto {
    return {
      resourceSlug: model.resourceId,
      description: model.description,
      amount: model.amount
    }
  }

  public dtoToModel(dto: ResponseItemDto) : ResponseItem {
    return {
      resource: this.resourceConverter.shortDtoToShortModel(dto.resource),
      description: dto.description,
      amount: dto.amount
    }
  }
}
