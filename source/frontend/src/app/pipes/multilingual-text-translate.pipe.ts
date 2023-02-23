import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MultilingualText} from "../models/common/multilingual-text";
import {Observable} from "rxjs";
import {LanguageService} from "../services/language.service";

@Pipe({
  name: 'multilingualTextTranslate'
})
export class MultilingualTextTranslatePipe implements PipeTransform {
  constructor(private languageService: LanguageService) {}
  transform(value?: MultilingualText, lang: string = this.languageService.instantLanguage.code): string | undefined {
    return value ? value.getTextForLanguageOrDefault(lang).text : undefined
  }
}
