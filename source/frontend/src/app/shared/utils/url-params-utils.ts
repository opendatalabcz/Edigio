import {format, parse} from "date-fns";

export const dateWithoutTimeQueryParamFormat = 'ddMMyyyy'

export function optDateToUrlParam(date?: Date) : string | undefined {
  return date ? format(date, dateWithoutTimeQueryParamFormat) : undefined
}

export function optUrlParamToDate(param?: string | null): Date | undefined {
  return param ? parse(param, dateWithoutTimeQueryParamFormat, new Date()) : undefined
}
