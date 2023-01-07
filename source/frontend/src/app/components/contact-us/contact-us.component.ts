import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {FormlyFormsService} from "../../services/formly-forms.service";
import {Contact} from "../../models/common/contact";
import {Message} from "../../models/common/message";
import {ContactFormData} from "../../models/common/contact-form-data";
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
