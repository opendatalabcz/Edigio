import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";
import {AuthenticationService} from "../../services/authentication.service";
import {requireDefinedNotNull} from "../../shared/assertions/object-assertions";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {map, takeWhile} from "rxjs";
import {isObjectNotNullOrUndefined} from "../../shared/predicates/object-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

interface LoginFormControls {
  username: FormControl<string>
  password: FormControl<string>
}

@UntilDestroy(this)
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup<LoginFormControls>;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService) {
    this.form = fb.nonNullable.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  private checkIfUserIsLogged() {
    this.notificationService.startLoading("")
    this.userService.loggedUserInfo$(false)
      .pipe(
        map(isObjectNotNullOrUndefined),
        takeWhile((isLogged) => !isLogged, true),
        untilDestroyed(this)
      )
      .subscribe({
        next: (isLogged) => {
          this.notificationService.stopLoading()
          if (isLogged) {
            this.router.navigate(["/user"])
          }
        }
      })
  }

  ngOnInit(): void {
    this.checkIfUserIsLogged()
  }

  login() {
    if (this.form.invalid) {
      this.notificationService.failure('LOGIN_PAGE.INVALID_USERNAME_OR_PASSWORD', true)
      return
    }
    this.notificationService.startLoading("LOGIN_PAGE.SENDING", true)
    this.authenticationService.authenticate(
      requireDefinedNotNull(this.form.get("username")?.value),
      requireDefinedNotNull(this.form.get("password")?.value)
    ).subscribe({
      next: () => {
        this.notificationService.stopLoading()
        this.notificationService.success("LOGIN_PAGE.SUCCESS", true)
        this.router.navigate(["/user"])
      },
      error: () => {
        this.notificationService.stopLoading()
        this.notificationService.failure("LOGIN_PAGE.FAILURE", true)
      }
    })
  }
}
