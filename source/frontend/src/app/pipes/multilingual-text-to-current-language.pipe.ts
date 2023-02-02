import { Pipe, PipeTransform } from '@angular/core';
import {MultilingualText} from "../models/common/multilingual-text";
import {MultilingualTextService} from "../services/multilingual-text.service";
import {Observable, of} from "rxjs";

@Pipe({
  name: 'multilingualTextToCurrentLanguage'
})
export class MultilingualTextToCurrentLanguagePipe implements PipeTransform {

  constructor(private multilingualTextService: MultilingualTextService) {
  }
  transform(value?: MultilingualText): Observable<string | undefined> {
    return value ? this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(value) : of(undefined)
  }

}
