import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationService} from "../../services/notification.service";
import {AuthenticationService} from "../../services/authentication.service";
import {requireDefinedNotNull} from "../../utils/assertions/object-assertions";
import {Router} from "@angular/router";

interface LoginFormControls {
  username: FormControl<string>
  password: FormControl<string>
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup<LoginFormControls>;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {
    this.form = fb.nonNullable.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
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
        this.notificationService.success("LOGIN_PAGE.SUCCESS")
        this.router.navigate(["/user/edit"])
      },
      error: () => {
        this.notificationService.stopLoading()
        this.notificationService.failure("LOGIN_PAGE.FAILURE")
      }
    })
  }
}
