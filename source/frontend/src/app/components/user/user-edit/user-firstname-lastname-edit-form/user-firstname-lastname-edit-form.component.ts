import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {personNamePartValidator, phoneNumberValidator} from "../../../../validators/contact-validators";
import {RatedUser, User} from "../../../../models/common/user";

interface NameAndSurnameFormControls {
  firstname: FormControl<string>;
  lastname: FormControl<string>
}
@Component({
  selector: 'app-user-firstname-lastname-edit-form',
  templateUrl: './user-firstname-lastname-edit-form.component.html',
  styleUrls: ['./user-firstname-lastname-edit-form.component.scss']
})
export class UserFirstnameLastnameEditFormComponent implements OnInit {
  @Input() user?: User

  _nameAndSurnameForm?: FormGroup<NameAndSurnameFormControls>
  private set nameAndSurnameForm(form: FormGroup<NameAndSurnameFormControls>) {
    this._nameAndSurnameForm = form
  }
  get nameAndSurnameForm() : FormGroup<NameAndSurnameFormControls> {
    return requireDefinedNotNull(this._nameAndSurnameForm)
  }

  constructor(private fb: FormBuilder) {}


  private conditionalNamePartValidatorFn(validatedPart: 'firstname' | 'lastname') : ValidatorFn {
    return RxwebValidators.compose({
      validators: [personNamePartValidator],
      conditionalExpression: (formControlsValues: {firstname: string, lastname: string}) => {
        return !!formControlsValues[validatedPart]
      }
    })
  }

  ngOnInit(): void {
    this.nameAndSurnameForm = this.fb.nonNullable.group({
      firstname: ['', [this.conditionalNamePartValidatorFn('firstname')]],
      lastname: ['', [this.conditionalNamePartValidatorFn('lastname')]],
    })
  }


}
