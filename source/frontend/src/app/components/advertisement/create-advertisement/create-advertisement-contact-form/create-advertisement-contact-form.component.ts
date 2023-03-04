import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {email, RxwebValidators} from "@rxweb/reactive-form-validators";
import {Nullable} from "../../../../utils/types/common";
import {personNamePartValidator, phoneNumberValidator} from "../../../../validators/contact-validators";
import {Contact, PublishedContactDetailSettings} from "../../../../models/common/contact";
import {ContactFormData} from "../../../../models/common/contact-form-data";

class ContactFormControlNames {
  firstname = "firstname"
  lastname = "lastname"
  email = "email"
  repeatEmail = "repeatEmail"
  telephoneNumber = "telephoneNumber"
  repeatTelephoneNumber = "repeatTelephoneNumber"
  publishedDetails = "publishedDetails"
  privacyPolicyConsent = "privacyPolicyConsent"
  termsOfServiceConsent = "termsOfServiceConsent"
}

interface FormControls {
  firstname: FormControl<string>
  lastname: FormControl<string>
  email: FormControl<string>
  repeatEmail: FormControl<string>
  telephoneNumber: FormControl<Nullable<string>>
  repeatTelephoneNumber: FormControl<Nullable<string>>
  publishedDetails: FormControl<PublishedContactDetailSettings>
  privacyPolicyConsent: FormControl<boolean>;
  termsOfServiceConsent: FormControl<boolean>
}

export interface CreateAdvertisementContactFormResult {
  contact: Nullable<Contact>
  publishedContactDetailsSettings: Nullable<PublishedContactDetailSettings>
  isValid: boolean
}

@Component({
  selector: 'app-create-advertisement-contact-form',
  templateUrl: './create-advertisement-contact-form.component.html',
  styleUrls: ['./create-advertisement-contact-form.component.scss']
})
export class CreateAdvertisementContactFormComponent {
  formControlNames = new ContactFormControlNames()
  formControls: FormControls
  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formControls = this.createFormControls()
    this.formGroup = this.createContactFormFromFormControls(this.formControls)
  }

  private createFormControls() : FormControls {
    return {
      firstname: this.fb.nonNullable.control('', [Validators.required, personNamePartValidator]),
      lastname: this.fb.nonNullable.control('', [Validators.required, personNamePartValidator]),
      email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
      repeatEmail: this.fb.nonNullable.control(
        '',
        [Validators.required, RxwebValidators.compare({fieldName: this.formControlNames.email})]
      ),
      telephoneNumber: this.fb.control('', [phoneNumberValidator]),
      repeatTelephoneNumber: this.fb.control(
        '',
        [RxwebValidators.compare({fieldName: this.formControlNames.telephoneNumber})]
      ),
      publishedDetails: this.fb.nonNullable.control({lastname: false, email: true, telephoneNumber: false}),
      privacyPolicyConsent: this.fb.nonNullable.control(false, [Validators.requiredTrue]),
      termsOfServiceConsent: this.fb.nonNullable.control(false, [Validators.requiredTrue])
    }
  }

  private createContactFormFromFormControls(formControls: FormControls) : FormGroup {
    return this.fb.group({
      [this.formControlNames.firstname]: formControls.firstname,
      [this.formControlNames.lastname]: formControls.lastname,
      [this.formControlNames.email]: formControls.email,
      [this.formControlNames.repeatEmail]: formControls.repeatEmail,
      [this.formControlNames.telephoneNumber]: formControls.telephoneNumber,
      [this.formControlNames.repeatTelephoneNumber]: formControls.repeatTelephoneNumber,
      [this.formControlNames.publishedDetails]: formControls.publishedDetails,
      [this.formControlNames.privacyPolicyConsent]: formControls.privacyPolicyConsent,
      [this.formControlNames.termsOfServiceConsent]: formControls.termsOfServiceConsent,
    })
  }

  private currentContact() : Contact {
    return {
      firstname: this.formControls.firstname.value,
      lastname: this.formControls.lastname.value,
      email: this.formControls.email.value,
      telephoneNumber: this.formControls.telephoneNumber.value
    }
  }

  getResult() : CreateAdvertisementContactFormResult {
    const isValid = this.formGroup.valid
    console.log(isValid ? 'valid' : 'invalid')
    return {
      contact: isValid ? this.currentContact() : null,
      publishedContactDetailsSettings: isValid ? this.formControls.publishedDetails.value : null,
      isValid
    }
  }
}
