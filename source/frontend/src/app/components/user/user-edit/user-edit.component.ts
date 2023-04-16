import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {NotificationService} from "../../../services/notification.service";
import {User} from "../../../models/common/user";
import {map, takeWhile} from "rxjs";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

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


  user: User = {
    id: '123',
    username: 'johndoe',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@doe.com',
    telephoneNumber: '123456789',
    publishedDetails: {
      firstname: true,
      email: true,
      lastname: false
    },
    spokenLanguages: [{code: 'cs', name: 'Čeština'}]
  };

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private notificationService: NotificationService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userService.loggedUserInfo$(false)
      .pipe(
        map(isObjectNotNullOrUndefined),
        takeWhile(isLogged => isLogged, true),
        untilDestroyed(this)
      )
      .subscribe({
        next: (isLogged) => {
          if (!isLogged) {
            this.router.navigate(["/login"])
          }
        }
      })
  }

  onPhoneNumberSubmit(form: FormGroup<TelephoneNumberEditFormControls>) {
    if (form.invalid) {
      //Shouldn't happen, but in case it did, let's add one additional failsafe here
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED")
    }
  }

}
