import {LocalizedText} from "../models/common/multilingual-text";

export interface MultilingualTextDto {
  defaultLanguageCode: string,
  texts: LocalizedText[]
}
