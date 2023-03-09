import {Injectable} from '@angular/core';
import {RatedUser} from "../models/common/user";
import {filter, map, Observable, tap, timer} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {isObjectNotNullOrUndefined} from "../utils/predicates/object-predicates";
import {Contact} from "../models/common/contact";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private ratedUsers: RatedUser[] = [{
    id: 'userone',
    username: 'john.doe',
    firstname: 'johny',
    lastname: 'doe',
    email: 'john.doe@example.org',
    telephoneNumber: '+420777777777',
    avatarUrl: 'https://cdn.pixabay.com/photo/2022/10/31/20/27/lioness-7560708_960_720.jpg',
    ratingScore: 3.5,
    knownLanguages: ['cs', 'en', 'pl']
  }]

  constructor() {
  }

  public getUserRating$(id: string): Observable<RatedUser> {
    const user = this.ratedUsers.find(usr => usr.id.localeCompare(id))
    return timer(300).pipe(
      tap(() => {
        if (!user) {
          throw new HttpErrorResponse({status: 404})
        }
      }),
      map(() => user),
      //At this moment i know that user is defined, but it wouldn't run without this piece of code
      filter(isObjectNotNullOrUndefined)
    )
  }

  public currentUserContact$(): Observable<Contact> {
    //TODO: Add logic when user is implemented - using observable as retrieval from server might be needed
    return timer(200).pipe(
      map(() => ({
        firstname: '',
        lastname: '',
        email: '',
        telephoneNumber: ''
      })))
  }

  public requestCurrentUserEmailChange$(newEmail: string) {
    //TODO: Implement email change logic
    return timer(200).pipe(map(() => new HttpResponse({status: 200})))
  }

  public confirmCurrentUserEmailChange$(codes: { originalEmailCode: string, newEmailCode: string }) {
    //TODO: When server side logic is implemented,
    return timer(200)
      .pipe(
        tap(() => {
          if (codes.originalEmailCode !== codes.newEmailCode) {
            throw new HttpErrorResponse({status: 403})
          }
        }),
        map(() => new HttpResponse({status: 200}))
      )
  }
}
