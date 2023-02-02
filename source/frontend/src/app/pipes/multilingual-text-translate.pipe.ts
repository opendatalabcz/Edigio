import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {MultilingualText} from "../models/common/multilingual-text";
import {Observable} from "rxjs";

@Pipe({
  name: 'multilingualTextTranslate'
})
export class MultilingualTextTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(value?: MultilingualText, lang: string = this.translateService.currentLang): string | undefined {
    return value ? value.getTextForLanguageOrDefault(lang).text : undefined
  }
}
