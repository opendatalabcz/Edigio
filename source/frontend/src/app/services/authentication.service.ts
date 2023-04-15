import { Injectable } from '@angular/core';
import {UserService} from "./user.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {LOGIN_API_URL} from "../api-config/auth-api-config";
import {Observable} from "rxjs";

/**
 * Service used to authenticate user
 *
 * Tracking current user info is responsibility of {@link UserService}
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _authenticated = false

  private refreshToken() {
    //TODO: Add token refresh logic
  }

  public get authenticated() : boolean {
    return this._authenticated
  }

  constructor(private userService: UserService, private httpClient: HttpClient) { }

  public authenticate(username: string, password: string): Observable<void> {
    if(this.authenticated) {
      throw new Error("User is already authenticated! Signout before authentication!")
    }
    return this.httpClient.post<void>(
      LOGIN_API_URL,
      new HttpParams()
        .set('username', username)
        .set('password', password),
      {
        withCredentials: true,
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    )
  }
}
