import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {Router} from "@angular/router";
import {isInRange} from "../predicates/math-predicates";
import {EMPTY, Observable, of} from "rxjs";
import {NotificationService} from "../../services/notification.service";

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

export function noCodeUserSettingsEditErrorHandler(
  err: unknown,
  router: Router,
  notificationService: NotificationService
) : Observable<undefined> {
  if(err instanceof HttpErrorResponse) {
    if(err.status == HttpStatusCode.Forbidden || err.status == HttpStatusCode.Unauthorized) {
      notificationService.warning("USER.LOGGED_OUT_AUTOMATICALLY", true)
      router.navigate(["/login"])
    } else {
      return universalHttpErrorResponseHandler(err, router)
    }
  } else {
    notificationService.failure("UNKNOWN_ERROR", true)
  }
  return EMPTY
}
