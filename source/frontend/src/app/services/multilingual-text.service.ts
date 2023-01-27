import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {map, Observable, ReplaySubject, Subscription} from "rxjs";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";

interface TextToTranslate {
  multilangText: MultilingualText,
  subject$: ReplaySubject<LocalizedText>
}


@Injectable({
  providedIn: 'root'
})
export class MultilingualTextService {
  private textsToTranslate: TextToTranslate[] = []
  private onLangChangeSubscription: Subscription

  constructor(
    private translateService: TranslateService,
  ) {
    this.onLangChangeSubscription = translateService.onLangChange
      .subscribe(() => {
        this.translateObservingLocalizedTexts()
      })
  }

  private translateSingleLocalizedText(textToTranslate: TextToTranslate): void {
    textToTranslate.subject$.next(
      textToTranslate.multilangText.getTextForLanguageOrDefault(this.translateService.currentLang)
    )
  }

  private translateObservingLocalizedTexts() {
    this.textsToTranslate.forEach((textToTranslate) => {
      this.translateSingleLocalizedText(textToTranslate)
    })
  }

  public toLocalizedTextForCurrentLanguage$(text: MultilingualText): Observable<LocalizedText> {
    const textToTranslate: TextToTranslate = {multilangText: text, subject$: new ReplaySubject<LocalizedText>(1)}
    this.translateSingleLocalizedText(textToTranslate)
    this.textsToTranslate.push(textToTranslate)
    return textToTranslate.subject$
  }

  public toLocalizedTextValueForCurrentLanguage$(text: MultilingualText): Observable<string> {
    return this.toLocalizedTextForCurrentLanguage$(text).pipe(map(localizedText => localizedText.text))
  }
}
