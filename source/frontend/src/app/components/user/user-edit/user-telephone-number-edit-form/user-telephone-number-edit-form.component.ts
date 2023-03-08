import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {phoneNumberValidator} from "../../../../validators/contact-validators";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {NotificationService} from "../../../../services/notification.service";
import {User} from "../../../../models/common/user";

interface TelephoneNumberEditFormControls {
  telephoneNumber: FormControl<string>
  repeatTelephoneNumber: FormControl<string>
}

@Component({
  selector: 'app-user-telephone-number-edit-form',
  templateUrl: './user-telephone-number-edit-form.component.html',
  styleUrls: ['./user-telephone-number-edit-form.component.scss']
})
export class UserTelephoneNumberEditFormComponent implements OnInit {
  @Input() user: User = {}

  _telephoneNumberEditForm?: FormGroup<TelephoneNumberEditFormControls>
  private set telephoneNumberEditForm(form: FormGroup<TelephoneNumberEditFormControls>) {
    this._telephoneNumberEditForm = form
  }
  get telephoneNumberEditForm() : FormGroup<TelephoneNumberEditFormControls> {
    return requireDefinedNotNull(this._telephoneNumberEditForm)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.telephoneNumberEditForm = this.fb.nonNullable.group({
      telephoneNumber: ['', [Validators.required, phoneNumberValidator]],
      repeatTelephoneNumber: ['', [RxwebValidators.compare({fieldName: 'telephoneNumber'})]]
    })
  }

  onPhoneNumberSubmit(form: FormGroup<TelephoneNumberEditFormControls>) {
    if(form.invalid) {
      //Shouldn't happen, but in case it did, let's add one additional failsafe here
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED")
    }
  }

  get showNumberInvalidError() : boolean {
    return this.telephoneNumberEditForm.controls.telephoneNumber.hasError('required')
      || this.telephoneNumberEditForm.controls.telephoneNumber.hasError('phoneNumberInvalid')
  }
}
