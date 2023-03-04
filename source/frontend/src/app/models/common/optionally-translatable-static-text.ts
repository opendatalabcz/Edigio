/**
 * Interface for static text which may or may not need to be translated
 */
export interface OptionallyTranslatableStaticText {
  /**
   * When {@link translate} is {@code true}, then this value is translation key. Final text otherwise
   */
  readonly keyOrText: string
  /**
   * Indicator whether translation is needed for {@link keyOrText}
   */
  readonly translate: boolean
}
