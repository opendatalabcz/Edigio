import {Injectable} from '@angular/core';
import {LoggedUserInfo, User, UserRegistrationData} from "../models/common/user";
import {BehaviorSubject, map, Observable, switchMap, tap, timer} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {PublishedContactDetailSettings} from "../models/common/contact";
import {ReadOnlyLanguage} from "../models/common/language";
import {
  LOGGED_USER_DETAIL_API_URL,
  LOGGED_USER_EMAIL_CHANGE_REQUEST_API_URL,
  LOGGED_USER_INFO_API_URL,
  LOGGED_USER_PUBLISHED_CONTACT_DETAIL_SETTINGS_CHANGE_API_URL,
  LOGGED_USER_SPOKEN_LANGUAGES_CHANGE_API_URL,
  LOGGED_USER_TELEPHONE_CHANGE_REQUEST_API_URL,
  loggedUserEmailChangeRequestConfirmationApiUrl,
  loggedUserTelephoneNumberChangeRequestConfirmationApiUrl,
  publicUserInfoApiUrl,
  USER_REGISTRATION_API_URL,
  userContactConfirmationApiUrl
} from "../api-config/user-api-config";
import {LoggedUserInfoDto, PublicUserInfoDto, UserDto} from "../dto/user";
import {UserConverter} from "../shared/convertors/user-converter";
import {Nullable} from "../shared/types/common";
import {isObjectNotNullOrUndefined} from "../shared/predicates/object-predicates";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUserInfo$ = new BehaviorSubject<Nullable<LoggedUserInfo>>(null)

  constructor(
    private httpClient: HttpClient,
    private userConverter: UserConverter
  ) {
  }

  public getPublicUserInfo$(id: string): Observable<User> {
    return this.httpClient.get<PublicUserInfoDto>(publicUserInfoApiUrl(id))
      .pipe(map(dto => this.userConverter.publicUserInfoDtoToUserModel(dto)))
  }

  public getCurrentUser$(): Observable<User> {
    return this.httpClient.get<UserDto>(LOGGED_USER_DETAIL_API_URL)
      .pipe(map(dto => this.userConverter.userDtoToUser(dto)))
  }

  public loggedUserInfo$(forceRefresh = false): Observable<Nullable<LoggedUserInfo>> {
    if (forceRefresh) {
      return this.httpClient.get<Nullable<LoggedUserInfoDto>>(LOGGED_USER_INFO_API_URL)
        .pipe(
          map((dto) => {
            console.log("DTO: ", dto)
            return isObjectNotNullOrUndefined(dto) ? this.userConverter.loggedUserInfoDtoToLoggedUserInfo(dto) : null
          }),
          tap(info => this._loggedUserInfo$.next(info)),
          switchMap(() => this._loggedUserInfo$.asObservable())
        )
    }
    return this._loggedUserInfo$.asObservable()
  }

  public isUserLoggedIn$(): Observable<boolean> {
    return this.loggedUserInfo$(false).pipe(map(isObjectNotNullOrUndefined))
  }

  public loggedUserDetail$(): Observable<User> {
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

  public requestCurrentUserEmailChange$(newEmail: string): Observable<void> {
    return this.httpClient.post<void>(
      LOGGED_USER_EMAIL_CHANGE_REQUEST_API_URL,
      newEmail
    )
  }

  public confirmCurrentUserEmailChange$(codes: {
    currentEmailCode: string,
    newEmailCode: string
  }): Observable<void> {
    return this.httpClient.post<void>(
      loggedUserEmailChangeRequestConfirmationApiUrl(codes.currentEmailCode, codes.newEmailCode),
      {}
    )
  }

  requestCurrentUserPhoneNumberChange$(number: string): Observable<void> {
    return this.httpClient.post<void>(
      LOGGED_USER_TELEPHONE_CHANGE_REQUEST_API_URL,
      number
    )
  }

  confirmCurrentUserTelephoneNumberChange$(code: string): Observable<void> {
    return this.httpClient.post<void>(
      loggedUserTelephoneNumberChangeRequestConfirmationApiUrl(code),
      {}
    )
  }

  requestCurrentUserFirstnameOrLastnameChange$(
    _firstnameAndLastname: { firstname?: string, lastname?: string }
  ): Observable<HttpResponse<any>> {
    //TODO: Finish when firstname and lastname change is implemented
    throw new Error('Change request for firstname/lastname not implemented!');
  }

  confirmCurrentUserFirstnameOrLastnameChange$(_code: string): Observable<HttpResponse<any>> {
    //TODO: Finish when firstname and lastname change is implemented
    throw new Error('Change request confirmation for firstname/lastname not implemented!');
  }

  requestCurrentUserPublishedContactDetailsSettingsChange$(settings: PublishedContactDetailSettings): Observable<void> {
    return this.httpClient.put<void>(
      LOGGED_USER_PUBLISHED_CONTACT_DETAIL_SETTINGS_CHANGE_API_URL,
      settings
    )
  }

  requestCurrentUserSpokenLanguagesChange$(readOnlyLanguages: readonly ReadOnlyLanguage[]): Observable<void> {
    return this.httpClient.put<void>(
      LOGGED_USER_SPOKEN_LANGUAGES_CHANGE_API_URL,
      readOnlyLanguages.map((lang) => lang.code)
    )
  }
}
