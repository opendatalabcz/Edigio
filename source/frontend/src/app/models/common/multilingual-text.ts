export class UnknownLanguageCodeError extends Error {}

export class MultilingualText {
  constructor(private defaultLanguage: string, private texts: LocalizedText[] = []) {
  }

  public findTextForLanguage(language: string): LocalizedText | undefined {
    return this.texts.find(textWithLang => textWithLang.lang == language);
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
    return possiblyRequestedText ?? this.requireTextForLanguage(this.defaultLanguage);
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

  public static of(defaultText: LocalizedText, ...rest: LocalizedText[]) {
    return new MultilingualText(defaultText.lang, [defaultText, ...rest])
  }
}

export interface LocalizedText {
  text: string
  lang: string
}
