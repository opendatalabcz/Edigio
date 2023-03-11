import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {phoneNumberValidator} from "../../../validators/contact-validators";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {NotificationService} from "../../../services/notification.service";
import {User} from "../../../models/common/user";

interface TelephoneNumberEditFormControls {
  telephoneNumber: FormControl<string>
  repeatTelephoneNumber: FormControl<string>
}

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {


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
    knownLanguages: [{code: 'cs', name: 'Čeština'}]
  };

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService
  ) {}

  onPhoneNumberSubmit(form: FormGroup<TelephoneNumberEditFormControls>) {
    if(form.invalid) {
      //Shouldn't happen, but in case it did, let's add one additional failsafe here
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED")
    }
  }

}
