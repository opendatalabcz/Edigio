import {anyMatch} from "../../utils/array-utils";
import {isDefinedNotEmpty} from "../../utils/predicates/string-predicates";

export class UnknownLanguageCodeError extends Error {
}

export type MultilingualTextData = Map<string, LocalizedText>

/**
 * Class used to represent text that can be translated to multiple languages by user
 *
 * TODO: Transform to immutable
 */
export class MultilingualText {
  /**
   * Internal representation of stored objects
   *
   * <p>Keys are language codes of texts, and values are whole texts objects</p>
   * <p>This implementation was chosen, so it's as fast as possible to search for texts for languages</p>
   *
   * @private
   */
  private _texts: MultilingualTextData

  public get texts(): MultilingualTextData {
    return new Map(this._texts)
  }

  constructor(private defaultLanguageCode: string, texts: LocalizedText[]) {
    const textsMap = new Map<string, LocalizedText>(texts.map(text => [text.lang, text]))
    if(!textsMap.has(defaultLanguageCode)) {
      throw new UnknownLanguageCodeError('Missing text for default language!')
    }
    this._texts = textsMap
  }

  /**
   * Try to retrieve text for language. When language is not present, undefined is returned
   * @param language
   */
  public findTextForLanguage(language: string): LocalizedText | undefined {
    return this.texts.get(language);
  }

  /**
   * Retrieve text for language
   * @param language Language for which text should be retrieved
   * @throws UnknownLanguageCodeError when text for language is not present
   */
  public requireTextForLanguage(language: string): LocalizedText {
    const text = this.findTextForLanguage(language)
    if (text == undefined) {
      throw new UnknownLanguageCodeError()
    }
    return text
  }

  /**
   * Get text for given language. When the text is not available, get text for default language
   * @param language language for which text should be retrieved
   * @throws UnknownLanguageCodeError when language is not available
   */
  public getTextForLanguageOrDefault(language: string): LocalizedText {
    const possiblyRequestedText = this.findTextForLanguage(language)
    return possiblyRequestedText ?? this.requireTextForLanguage(this.defaultLanguageCode);
  }

  /**
   * Check whether text with matching language or default language (if matching language is not found)
   * contains part of given text value
   *
   * @param text Text whose value should we search for
   */
  public textWithSameLanguageOrDefaultContains(text: LocalizedText) {
    const resultText = this.getTextForLanguageOrDefault(text.lang)
    return resultText.text.indexOf(text.text) >= 0
  }

  /**
   * Sets text for {@link lang} language to given {@link text} value
   * @param lang langauge for which text value should be set
   * @param text value to set
   */
  public setTextForLang(lang: string, text: string) {
    this._texts.set(lang, {lang, text})
  }

  public isTextForLanguagePresent(lang: string) : boolean {
    return this._texts.has(lang)
  }

  /**
   * Set text for given language when not present.
   *
   * <p>When text for language is present, nothing is changed</p>
   * @param lang
   * @param text
   */
  public setTextForLangIfNotPresent(lang: string, text: string) : void {
    if(!this.isTextForLanguagePresent(lang)) {
      this.setTextForLang(lang, text)
    }
  }

  /**
   * Sets default language.
   *
   * <p>When text for {@link lang} is not present,
   * it either throws when {@link emptyIfNotPresent} is {@code false} or sets text for language to empty text.
   * When previous default text was empty, and {@link deletePreviousDefaultIfEmpty} is true, it will be deleted</p>
   *
   * @param lang
   * @param emptyIfNotPresent
   * @package
   */
  public setDefaultLanguage(lang: string, emptyIfNotPresent: boolean = false, deletePreviousDefaultIfEmpty: boolean = false) {
    if(!emptyIfNotPresent && !this.isTextForLanguagePresent(lang)) {
      throw new Error('Cannot set default language! Text for given language is not present, and auto-empty is not allowed')
    }
    //Either text is present or emptyIfNotPresent is set to true,
    // anyway it's now safe to call this function, and set text for language to empty if not present.
    //Decided to first set text to empty, and set language after that, as I wanted instance to stay in valid state for the whole time
    this.setTextForLangIfNotPresent(lang, '')
    const previousDefaultLang = this.defaultLanguageCode
    this.defaultLanguageCode = lang
    if(deletePreviousDefaultIfEmpty && !isDefinedNotEmpty(this.findTextForLanguage(previousDefaultLang)?.text))  {
      this.removeTextForLang(previousDefaultLang)
    }
  }

  /**
   * Create MultilingualText with {@link defaultText} language set as default, and other texts available
   *
   * @param defaultText text with default language of created text
   * @param rest other texts to include
   */
  public static of(defaultText: LocalizedText, ...rest: LocalizedText[]) {
    return new MultilingualText(defaultText.lang, [defaultText, ...rest])
  }

  /**
   * Get all languages for which texts are available (but possibly blank/empty)
   */
  public get availableLanguages(): string[] {
    //As languages are keys of map, it's fair simple to retrieve them
    return Array.from( this.texts.keys() )
  }

  /**
   * Check whether given language is default for the text
   * @param lang language to check
   */
  public isLanguageDefault(lang: string) : boolean {
    return this.defaultLanguageCode === lang
  }

  /**
   * Removes text for given langauge
   * @param lang Language of text to remove
   * @throws Error when given language is default, as it would be in invalid state
   */
  public removeTextForLang(lang: string) : void {
    if(this.isLanguageDefault(lang)) {
      throw new Error('Cannot remove text for default language!')
    }
    if(!this._texts.delete(lang)){
      console.warn(`Language "${lang}" not found!`)
    }
  }
}

/**
 * Text for single language
 */
export interface LocalizedText {
  /**
   * Text value
   */
  readonly text: string
  /**
   * Language of {@link text}
   */
  readonly lang: string
}
