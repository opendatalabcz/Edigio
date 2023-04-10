import {parseISO} from "date-fns";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ApiDateTimeConverter {
  stringToDate(value: string): Date {
    return parseISO(value)
  }
}
