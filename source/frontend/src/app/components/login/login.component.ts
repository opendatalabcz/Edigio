import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Notify} from "notiflix";
import {NotificationService} from "../../services/notification.service";

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
              private notificationService: NotificationService) {
    this.form = fb.nonNullable.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    })
  }

  login() {
    if(this.form.invalid) {
      this.notificationService.failure('LOGIN_PAGE.INVALID_USERNAME_OR_PASSWORD', true)
      return
    }
  }
}
