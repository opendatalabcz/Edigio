import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {map, Observable, ReplaySubject, Subscription} from "rxjs";
import {LocalizedText, MultilingualText} from "../models/common/multilingual-text";

/**
 * Utility interface used to keep text that should translated,
 *  and subject which is used to emit when language (and translation) is changed.
 * Chosen this way of implementation, as it allows me
 */
interface TextToTranslate {
  multilangText: MultilingualText,
  subject$: ReplaySubject<LocalizedText>
}

/**
 * Service used for more advanced work with MultilingualText.
 *
 * While simple actions like retrieval of text for given language can be done easily by MultilingualText object,
 * retrieval of text in language set for application at time of retrieval (and possibly later on) is not that easy.
 * (at minimum, TranslateService would be needed to get current language). That's what this service is made for.
 */
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
    //Retrieve translation of given text for current language and emit to its subject
    textToTranslate.subject$.next(
      textToTranslate.multilangText.getTextForLanguageOrDefault(this.translateService.currentLang)
    )
  }

  private translateObservingLocalizedTexts() {
    this.textsToTranslate.forEach((textToTranslate) => {
      this.translateSingleLocalizedText(textToTranslate)
    })
  }

  /**
   * Retrieve LocalizedText as observable that
   * @param text
   */
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
