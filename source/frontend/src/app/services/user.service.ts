import {Injectable} from '@angular/core';
import {User, UserRegistrationData} from "../models/common/user";
import {map, Observable, tap, timer} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode} from "@angular/common/http";
import {PublishedContactDetailSettings} from "../models/common/contact";
import {ReadOnlyLanguage} from "../models/common/language";
import {
  publicUserInfoApiUrl,
  USER_REGISTRATION_API_URL,
  userContactConfirmationApiUrl
} from "../api-config/user-api-config";
import {PublicUserInfoDto} from "../dto/user";
import {UserConverter} from "../utils/convertors/user-converter";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(
    private httpClient: HttpClient,
    private userConverter: UserConverter
  ) {
  }

  public getUser$(id: string): Observable<User> {
    return this.httpClient.get<PublicUserInfoDto>(publicUserInfoApiUrl(id))
      .pipe(map(dto => this.userConverter.publicUserInfoDtoToUserModel(dto)))
  }

  public currentUser$(): Observable<User> {
    //TODO: Add logic when user is implemented - using observable as retrieval from server might be needed
    return timer(200).pipe(
      map(() => ({
        firstname: '',
        lastname: '',
        email: '',
        telephoneNumber: ''
      })))
  }

  public confirmUserEmail$(id: string, token: string): Observable<void> {
    return this.httpClient.post(userContactConfirmationApiUrl(id, token), null)
      .pipe(map(() => undefined))
  }

  public register(userRegistrationData: UserRegistrationData): Observable<void> {
    return this.httpClient.post<void>(USER_REGISTRATION_API_URL, userRegistrationData)
  }

  public requestCurrentUserEmailChange$(newEmail: string): Observable<HttpStatusCode> {
    //TODO: Implement email change logic
    return timer(200).pipe(map(() => HttpStatusCode.Ok))
  }

  public confirmCurrentUserEmailChange$(codes: {
    originalEmailCode: string,
    newEmailCode: string
  }): Observable<HttpStatusCode> {
    //TODO: When server side logic is implemented,
    return timer(200)
      .pipe(
        tap(() => {
          if (codes.originalEmailCode !== codes.newEmailCode) {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => HttpStatusCode.Ok)
      )
  }

  requestCurrentUserPhoneNumberChange$(): Observable<HttpStatusCode> {
    //TODO: Implement telephone number change logic
    return timer(200).pipe(map(() => HttpStatusCode.Ok))
  }

  confirmCurrentUserTelephoneNumberChange$(code: string): Observable<HttpStatusCode> {
    return timer(200)
      .pipe(
        tap(() => {
          if (code !== '12345') {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => HttpStatusCode.Ok)
      )
  }

  requestCurrentUserFirstnameOrLastnameChange$(firstnameAndLastname: { firstname?: string, lastname?: string }) {
    return timer(200).pipe(map(() => new HttpResponse({status: 200})))
  }

  confirmCurrentUserFirstnameOrLastnameChange$(code: string) {
    return timer(200)
      .pipe(
        tap(() => {
          if (code !== '12345') {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => new HttpResponse({status: 200}))
      )
  }

  requestCurrentUserPublishedContactDetailsSettingsChange$(settings: PublishedContactDetailSettings) {
    return timer(200).pipe(map(() => new HttpResponse({status: 200})))
  }

  confirmCurrentUserPublishedContactDetailsSettingsChange$(code: string) {
    return timer(200)
      .pipe(
        tap(() => {
          if (code !== '12345') {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => new HttpResponse({status: 200}))
      )
  }

  requestCurrentUserSpokenLanguagesChange$(readOnlyLanguages: readonly ReadOnlyLanguage[]) {
    return timer(200).pipe(map(() => new HttpResponse({status: 200})))
  }

  confirmCurrentUserSpokenLanguagesChange$(code: string) {
    return timer(200)
      .pipe(
        tap(() => {
          if (code !== '12345') {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => new HttpResponse({status: 200}))
      )
  }
}
