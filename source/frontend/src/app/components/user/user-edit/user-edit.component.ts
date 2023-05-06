import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {User} from "../../../models/common/user";
import {isObjectNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {universalHttpErrorResponseHandler} from "../../../shared/utils/error-handling-functions";

interface TelephoneNumberEditFormControls {
  telephoneNumber: FormControl<string>
  repeatTelephoneNumber: FormControl<string>
}

@UntilDestroy(this)
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {


  user: User = {}

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private notificationService: NotificationService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userService.getCurrentUser$()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe({
        next: (user) => {
          if (isObjectNullOrUndefined(user)) {
            this.router.navigate(["/login"])
          }
          this.user = user
        },
        error: (err) => universalHttpErrorResponseHandler(err, this.router)
      })
  }

  onPhoneNumberSubmit(form: FormGroup<TelephoneNumberEditFormControls>) {
    if (form.invalid) {
      //Shouldn't happen, but in case it did, let's add one additional failsafe here
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED")
    }
  }

}
