/**
 * Enclose given string in opening and closing string
 *
 * @param value String to be enclosed
 * @param opening Opening part
 * @param closing Closing part
 *
 * @return string enclosed string
 */
export function enclose(value: string, opening: string = '', closing: string = '') : string {
  return `${opening}${value}${closing}`
}

/**
 * Enclose given string when it is not undefined and not blank
 *
 * @param value String to be enclosed
 * @param opening Opening part
 * @param closing Closing part
 *
 * @return string enclosed string when not blank and not undefined, identity otherwise
 */
export function encloseIfDefinedNotBlank(value?: string,
                                  opening: string = '',
                                  closing: string = '') {
  return value ? enclose(value, opening, closing) : value
}
