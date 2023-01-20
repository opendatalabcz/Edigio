import { Component } from '@angular/core';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({template: ''})
export abstract class AutounsubscribingTranslatingComponent {
  constructor(protected translationService: TranslateService) {}

  protected getTranslationStream(translationKey: string) : Observable<string>{
    return this.translationService
      .stream(translationKey)
      .pipe(untilDestroyed(this))
  }

  protected get onLangChangeEvent$() : Observable<LangChangeEvent> {
    return this.translationService
      .onLangChange
      .pipe(untilDestroyed(this))
  }
}
