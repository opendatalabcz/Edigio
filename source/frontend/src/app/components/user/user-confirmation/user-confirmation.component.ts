import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EMPTY, first, map, mergeMap, tap} from "rxjs";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {LoadingType, NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-user-confirmation',
  template: '',
})
export class UserConfirmationComponent implements OnInit {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  private onFail() {
    this.notificationService.stopLoading()
    this.notificationService.failure("USER_CONFIRMATION.FAILURE", true)
    this.router.navigate(["/projects"])
  }

  ngOnInit() {
    this.notificationService.startLoading("", false, LoadingType.PROCESSING)
    this.activatedRoute.paramMap
      .pipe(
        map(params => ({
          //Public id of user
          id: params.get("publicId"),
          //Confirmation token
          token: params.get("token")
        })),
        tap(idAndToken => {
          if (isObjectNullOrUndefined(idAndToken.id) || isObjectNullOrUndefined(idAndToken.token)) {
            this.onFail()
          }
        }),
        mergeMap(idAndToken => {
          if (isObjectNullOrUndefined(idAndToken.id) || isObjectNullOrUndefined(idAndToken.token)) {
            return EMPTY
          }
          return this.userService.confirmUserEmail$(idAndToken.id, idAndToken.token)
        }),
        first()
      )
      .subscribe({
          next: () => {
            this.notificationService.stopLoading()
            this.notificationService.success("USER_CONFIRMATION.SUCCESS", true)
            this.router.navigate(["/projects"])
          },
          error: (err) => {
            this.onFail()
          }
        }
      )
  }
}
