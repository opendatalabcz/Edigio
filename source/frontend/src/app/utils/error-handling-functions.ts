import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {isInRange} from "./predicates/math-predicates";
import {Observable, of} from "rxjs";

export function universalHttpErrorResponseHandler(err: HttpErrorResponse, router: Router) : Observable<undefined> {
  if (err.status == 403) {
    router.navigate(['/errors/forbidden'])
  } else if (err.status == 404) {
    router.navigate(['/errors/not-found'])
  } else if (err.status == 500) {
    router.navigate(['/errors/internal-server-error'])
  } else if(isInRange(err.status, 400, 499)) {
    router.navigate(['/errors/4xx'])
  } else if(isInRange(err.status, 500, 599)) {
    router.navigate(['/errors/5xx'])
  }
  return of(undefined)
}
