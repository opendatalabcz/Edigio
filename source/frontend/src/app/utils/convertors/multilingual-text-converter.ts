import {Injectable} from "@angular/core";
import {MultilingualTextDto} from "../../dto/mutlilingual-text";
import {MultilingualText} from "../../models/common/multilingual-text";

@Injectable({
  providedIn: 'root'
})
export class MultilingualTextConverter {
  public dtoToModel(dto: MultilingualTextDto): MultilingualText {
    return new MultilingualText(dto.defaultLanguageCode, dto.texts)
  }
}
