import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {phoneNumberValidator} from "../../validators/contact-validators";
import {RxwebValidators} from "@rxweb/reactive-form-validators";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  form: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstname: ['', [
        Validators.required,
        RxwebValidators.notEmpty()
      ]],
      lastname: ['', [
        Validators.required,
        RxwebValidators.notEmpty()
      ]],
      email: ['', [Validators.required, Validators.email]],
      telephoneNumber: ['', [phoneNumberValidator]]
    })
  }

  onSubmit(data: FormGroup) {
    console.dir(data)
  }
}
