import {anyMatch} from "../../utils/array-utils";

export class UnknownLanguageCodeError extends Error {
}

export class MultilingualText {
  /**
   * Internal representation of stored objects
   *
   * <p>Keys are language codes of texts, and values are whole texts objects</p>
   * <p>This implementation was chosen, so it's as fast as possible to search for texts for languages</p>
   *
   * @private
   */
  private texts: Map<string, LocalizedText>;
  constructor(private defaultLanguageCode: string, texts: LocalizedText[]) {
    const defaultLanguageInTexts = anyMatch(
      texts,
      (localizedText) => localizedText.lang.localeCompare(defaultLanguageCode) === 0
    )
    if (!defaultLanguageInTexts) {
      throw new Error(`Cannot construct MultilingualText without text for default language "${defaultLanguageCode}"!`)
    }
    this.texts = new Map<string, LocalizedText>(texts.map(text => [text.lang, text]))
  }

  public findTextForLanguage(language: string): LocalizedText | undefined {
    return this.texts.get(language);
  }

  public requireTextForLanguage(language: string): LocalizedText {
    const text = this.findTextForLanguage(language)
    if (text == undefined) {
      throw new UnknownLanguageCodeError()
    }
    return text
  }

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

  public setTextForLang(lang: string, text: string) {
    this.texts.set(lang, {lang, text})
  }

  public static of(defaultText: LocalizedText, ...rest: LocalizedText[]) {
    return new MultilingualText(defaultText.lang, [defaultText, ...rest])
  }

  public get availableLanguages(): string[] {
    //As languages are keys of map, it's fair simple to retrieve them
    return Array.from( this.texts.keys() )
  }
}

export interface LocalizedText {
  readonly text: string
  readonly lang: string
}
