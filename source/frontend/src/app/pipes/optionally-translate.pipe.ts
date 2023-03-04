import { Pipe, PipeTransform } from '@angular/core';
import {OptionallyTranslatableStaticText} from "../models/common/optionally-translatable-static-text";
import {TranslatePipe} from "@ngx-translate/core";

@Pipe({
  name: 'optionallyTranslate',
  //Wasn't able to find out whether translate pipe is pure or impure.
  //I think that it should be impure, as it both, reacts to language change and reevaluates when translation is loaded.
  //Therefor I've chosen the safest way -> impure pipe
  pure: false
})
export class OptionallyTranslatePipe implements PipeTransform {

  constructor(private translatePipe: TranslatePipe) {
  }

  transform(value: OptionallyTranslatableStaticText): string {
    return value.translate ? this.translatePipe.transform(value.keyOrText) : value.keyOrText;
  }

}
