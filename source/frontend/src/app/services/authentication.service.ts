import {Injectable} from '@angular/core';
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LOGIN_API_URL, LOGOUT_API_URL} from "../api-config/auth-api-config";
import {Observable} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

/**
 * Service used to authenticate user
 *
 * Tracking current user info is responsibility of {@link UserService}
 */
@UntilDestroy(this)
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _authenticated = false

  public get authenticated(): boolean {
    return this._authenticated
  }

  constructor(private userService: UserService, private httpClient: HttpClient) {
    this.userService.isUserLoggedIn$()
      .pipe(untilDestroyed(this))
      .subscribe((status) => this._authenticated = status)
  }

  public authenticate(username: string, password: string): Observable<void> {
    if (this.authenticated) {
      throw new Error("User is already authenticated! Signout before authentication!")
    }
    return this.httpClient.post<void>(
      LOGIN_API_URL,
      new HttpParams()
        .set('username', username)
        .set('password', password),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
  }

  public logout$(): Observable<void> {
    if (!this.authenticated) {
      throw new Error("User is already authenticated! Signout before authentication!")
    }
    return this.httpClient.post<void>(LOGOUT_API_URL, null, {})
  }
}
