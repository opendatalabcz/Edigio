import {Project, ProjectShort} from "../../models/projects/project";
import {Injectable} from "@angular/core";
import {CatastropheType} from "../../models/projects/catastrophe-type";
import {ProjectShortDto} from "../../dto/project";
import {MultilingualTextConverter} from "./multilingual-text-converter";
import {ProjectDetailsIntroPage} from "../../models/projects/projectPages";
import {ProjectDetailsIntroPageDto} from "../../dto/projectPages";
import {ResourceShortDto} from "../../dto/resource";
import {ResourceShort} from "../../models/advertisement/resource";

@Injectable({
  providedIn: 'root'
})
export class ResourceConverter {
  constructor(private multilingualTextConverter: MultilingualTextConverter) {}


  public resourceShortDtoToResourceShort(dto: ResourceShortDto): ResourceShort {
    return {
      name: this.multilingualTextConverter.dtoToModel(dto.name),
      id: dto.slug
    }
  }
}
