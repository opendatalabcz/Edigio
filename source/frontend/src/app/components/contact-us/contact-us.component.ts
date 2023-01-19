import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {
  personNamePartValidator,
  phoneNumberRegex,
  phoneNumberValidator,
  validNamePartRegex
} from "../../validators/contact-validators";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  form : FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstname: ['', [Validators.required, personNamePartValidator]],
      lastname: ['', [Validators.required, personNamePartValidator]],
      email: ['', [Validators.required, Validators.email]],
      telephoneNumber: ['', [phoneNumberValidator]]
    })
  }

  onSubmit(data: FormGroup  ) {
    console.log('Message will be sent with data: ')
    console.dir(data)
  }
}