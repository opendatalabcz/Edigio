import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";
import {LoggedUserInfo} from "../models/common/user";
import {Nullable} from "../shared/types/common";

@Injectable({
  providedIn: 'root'
})
export class LoggedUserResolver implements Resolve<Nullable<LoggedUserInfo>> {

  constructor(private userService: UserService,) {
  }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Nullable<LoggedUserInfo>> {
    return this.userService.loggedUserInfo$(true)
  }
}
