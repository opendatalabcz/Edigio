export interface Language {
  /**
   * Name of language as it's called by users (e.g. english, čeština...)
   */
  name: string
  /**
   * Language code used by the application
   */
  code: string
}

export interface ReadOnlyLanguage {
  /**
   * Name of language as it's called by users (e.g. english, čeština...)
   */
  readonly name: string
  /**
   * Language code used by the application
   */
  readonly code: string
}
