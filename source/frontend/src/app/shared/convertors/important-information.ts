import {Injectable} from "@angular/core";
import {ImportantInformationDto, ImportantInformationLinkDto} from "../../dto/projectPages";
import {ImportantInformation, ImportantInformationLink} from "../../models/projects/projectPages";
import {MultilingualTextConverter} from "./multilingual-text-converter";

@Injectable({
  providedIn: 'root'
})
export class ImportantInformationConverter {
  constructor(private multilingualTextConverter: MultilingualTextConverter) {}


  importantInformationLinkDtoToImportantInformationLink(dto: ImportantInformationLinkDto): ImportantInformationLink {
    return {
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      location: dto.location
    }
  }

  importantInformationDtoToImportantInformation(dto: ImportantInformationDto): ImportantInformation {
    return {
      title: this.multilingualTextConverter.dtoToModel(dto.title),
      text: this.multilingualTextConverter.dtoToModel(dto.text),
      links: dto.links.map(
        link => this.importantInformationLinkDtoToImportantInformationLink(link)
      )
    }
  }
}
