import {Injectable} from "@angular/core";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {ResourceDto, ResourceShortDto} from "../../dto/resource";
import {Resource, ResourceShort} from "../../models/advertisement/resource";

@Injectable({
  providedIn: 'root'
})
export class ResourceConverter {
  constructor(private multilingualTextConverter: MultilingualTextConverter) {
  }


  public resourceShortDtoToResourceShort(dto: ResourceShortDto): ResourceShort {
    return {
      name: this.multilingualTextConverter.dtoToModel(dto.name),
      id: dto.slug
    }
  }

  dtoToModel(dto: ResourceDto): Resource {
    return {
      name: this.multilingualTextConverter.dtoToModel(dto.name),
      description: this.multilingualTextConverter.dtoToModel(dto.description),
      id: dto.slug
    }
  }
}
