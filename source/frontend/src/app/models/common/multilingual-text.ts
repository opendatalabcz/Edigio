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
    const possiblyRequestedText = this.texts.find(textWithLang => textWithLang.lang == language)
    return possiblyRequestedText ?? this.requireTextForLanguage(this.defaultLanguage);
  }
}

export interface LocalizedText {
  text: string
  lang: string
}
