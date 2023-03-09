import { Injectable } from '@angular/core';
import {UserService} from "./user.service";

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

  constructor(private userService: UserService) { }

  public authenticate(username: string, password: string) {
    if(this.authenticated) {
      throw new Error("User is already authenticated! Signout before authentication!")
    }
  }
}
