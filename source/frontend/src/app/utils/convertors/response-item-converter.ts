import {Injectable} from "@angular/core";
import {ResourceConverter} from "./resource-converter";
import {ResponseItemCreationData} from "../../models/advertisement/response-item";
import {ResponseItemCreateDto} from "../../dto/response-item";

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
}
