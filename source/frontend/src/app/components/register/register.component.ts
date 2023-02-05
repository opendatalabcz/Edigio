import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RxFormBuilder, RxwebValidators} from "@rxweb/reactive-form-validators";
import {phoneNumberValidator} from "../../validators/contact-validators";
import {NotificationComponent} from "../notification/notification.component";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form?: FormGroup;

  readonly MIN_PASSWORD_LENGTH = 8
  readonly MAX_PASSWORD_LENGTH = 64

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private router: Router
  ) {
  }

  ngOnInit() {
  this.form = this.fb.group({
      "username": ["", Validators.required],
      "password": ["", [
        Validators.required,
        Validators.minLength(this.MIN_PASSWORD_LENGTH),
        Validators.maxLength(this.MAX_PASSWORD_LENGTH)]
      ],
      "passwordRepeat": ["", RxwebValidators.compare({fieldName: 'password'})],
      "firstname": ["", RxwebValidators.compose({
        validators: [Validators.required, RxwebValidators.alpha()]
      })],
      "lastname": ["", Validators.required],
      "email": ["", RxwebValidators.compose({
        validators: [Validators.required, RxwebValidators.email()]
      })],
      "emailRepeat": ["", RxwebValidators.compare({fieldName: 'email'})],
      "telephoneNumber": ["", phoneNumberValidator],
      "privacyPolicyConsent": [false, Validators.requiredTrue],
      "termsOfServiceConsent": [false, Validators.requiredTrue]
    })
  }

  get showPasswordsMismatched(): boolean {
    return !!this.form?.get('passwordRepeat')?.getError('compare')
  }

  get showInvalidPhoneNumber() : boolean {
    return !!this.form?.get('telephoneNumber')?.hasError('phoneNumberInvalid')
  }

  get showShortPassword(): boolean {
    return !!this.form?.get('password')?.hasError('minlength')
  }

  get showLongPassword(): boolean {
    return !!this.form?.get('password')?.hasError('maxlength')
  }

  get showEmailsMismatched() : boolean {
    return !!this.form?.get('emailRepeat')?.hasError('compare')
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.notificationService.success("Successfully registered (at least try to pretend so :) )")
      console.log("Submitted")
      this.router.navigate(["/login"])
    } else {
      form.markAllAsTouched()
    }
  }
}
