import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Language, ReadOnlyLanguage} from "../models/common/language";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../utils/predicates/object-predicates";
import {BehaviorSubject, map, Observable} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

/**
 * Service that should be used to work with languages
 * e.g. change of current app language, retrieval of current language, monitoring language change...
 */
@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly _availableLanguages: readonly ReadOnlyLanguage[] = [
    {name: 'english', code: 'en'},
    {name: 'čeština', code: 'cs'},
  ]

  private _currentLanguage$: BehaviorSubject<ReadOnlyLanguage>

  constructor(private translateService: TranslateService) {
    //Initiliaze language with current language set in translate service
    this._currentLanguage$ = new BehaviorSubject(this.getReadOnlyLanguageByCode(translateService.currentLang));
    this._currentLanguage$
      .pipe(untilDestroyed(this))
      .subscribe((lang) => {
        this.translateService.use(lang.code)
      })
    this.translateService.onLangChange
      .pipe(
        map(outerLang => [outerLang.lang, this._currentLanguage$.value.code]),
        untilDestroyed(this)
      )
      .subscribe(([outerLangCode, innerLangCode]) => {
        //As it's tempting to use only translate service, it's log warning about code being set outside of our service
        if(outerLangCode.localeCompare(innerLangCode)) {
          console.warn(`Language code "${outerLangCode}" set in translate service
          differs from the "${innerLangCode}" that's set in language service! `)
        }
      })
  }

  /**
   * Available languages in readonly form
   *
   * Should be preferred whenever possible, as it doesn't copy anything, but simply provides existing instance as is
   */
  get readonlyAvailableLanguages() : readonly ReadOnlyLanguage[] {
    return this._availableLanguages
  }

  /**
   * All languages available in app
   *
   * <p><b>BEWARE:</b> this method creates new copy of both, array and existing instances,
   * usage of {@link readonlyAvailableLanguages} is encouraged whenever editable instances (or an editable array) are not needed!</p>
   */
  getAvailableLanguages(): Language[] {
    //I don't want available languages stored in this app to be modified from outside,
    // I have manually clone each of them and return them as a new array
    return this._availableLanguages.map(lang => (<Language>{...lang}))
  }

  languageWithCodeAvailable(code: string) : boolean {
    return isObjectNotNullOrUndefined(
      this.readonlyAvailableLanguages.find(lang => lang.code.localeCompare(code) === 0)
    )
  }

  /**
   * Get language with given code
   *
   * As code must be unique for each language, it's guaranteed that either single language or none language will match
   *
   * @param code Code of language
   * @throws Error when language code isn't known
   */
  getReadOnlyLanguageByCode(code: string) : ReadOnlyLanguage {
    const possiblyLang = this.readonlyAvailableLanguages.find(lang => lang.code.localeCompare(code) === 0)
    if(isObjectNullOrUndefined(possiblyLang)) {
      throw new Error(`Language with code ${code} not found!`)
    }
    return possiblyLang
  }

  /**
   * Change current application language to the language with given code
   *
   * @param code Code of language
   * @throws Error when language code isn't known
   */
  changeAppLanguageByCode(code: string) {
    //Logic for changing language is already set in subscription
    this._currentLanguage$.next(
      //As this function already checks for existence of language, there's no need to do it again here
      this.getReadOnlyLanguageByCode(code)
    )
  }

  /**
   * Observable current app language
   */
  get currentLanguage$(): Observable<ReadOnlyLanguage> {
    return this._currentLanguage$
  }

  /**
   * Language that's already set in call time
   */
  get instantLanguage(): ReadOnlyLanguage {
    return this._currentLanguage$.value
  }
}
