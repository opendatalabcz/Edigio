import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {map, Observable, tap} from 'rxjs';
import {UserService} from "../services/user.service";
import {LoggedUserInfo} from "../models/common/user";
import {Nullable} from "../utils/types/common";
import {NotificationService} from "../services/notification.service";

@Injectable({
  providedIn: 'root'
})
export class LoggedUserResolver implements Resolve<Nullable<LoggedUserInfo>> {

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {
  }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Nullable<LoggedUserInfo>> {
    return this.userService.loggedUserInfo$()
      .pipe(tap(info => {
        console.log("retrieved", info)
        localStorage.setItem('loggedUserInfo', JSON.stringify(info))
      }))
  }
}
