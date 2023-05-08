import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {phoneNumberValidator} from "../../validators/contact-validators";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";
import {passwordValidator} from "../../validators/password-validator";
import {UserService} from "../../services/user.service";
import {UserRegistrationData} from "../../models/common/user";
import {requireDefinedNotNull} from "../../shared/assertions/object-assertions";
import {first, map, Observable, takeWhile} from "rxjs";
import {isDefinedNotEmpty} from "../../shared/predicates/string-predicates";
import {isObjectNotNullOrUndefined} from "../../shared/predicates/object-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ProjectService} from "../../services/project.service";

@UntilDestroy()
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
              private userService: UserService,
              private projectService: ProjectService,
              private notificationService: NotificationService,
              private router: Router
  ) {
  }

  private checkIfUserIsLogged() {
    this.notificationService.startLoading("")
    this.userService.loggedUserInfo$(false)
      .pipe(
        map(isObjectNotNullOrUndefined),
        takeWhile((isLogged) => !isLogged, true),
        untilDestroyed(this)
      )
      .subscribe({
        next: (isLogged) => {
          this.notificationService.stopLoading()
          if (isLogged) {
            this.router.navigate(["/user"])
          }
        }
      })
  }

  ngOnInit() {
    this.checkIfUserIsLogged()
    this.form = this.fb.group({
      "username": [null, Validators.required],
      "password": [null, [
        Validators.required,
        Validators.minLength(this.MIN_PASSWORD_LENGTH),
        Validators.maxLength(this.MAX_PASSWORD_LENGTH),
        passwordValidator
      ]],
      "passwordRepeat": [null, RxwebValidators.compare({fieldName: 'password'})],
      "firstname": [null, RxwebValidators.compose({
        validators: [Validators.required, RxwebValidators.alpha()]
      })],
      "lastname": [null, Validators.required],
      "email": [null, RxwebValidators.compose({
        validators: [Validators.required, RxwebValidators.email()]
      })],
      "emailRepeat": [null, RxwebValidators.compare({fieldName: 'email'})],
      "telephoneNumber": [null, phoneNumberValidator],
      "privacyPolicyConsent": [false, Validators.requiredTrue],
      "termsOfServiceConsent": [false, Validators.requiredTrue]
    })
  }

  get privacyPolicyUrl$() : Observable<string> {
    return this.projectService.routeRelativeToCurrentProject$('privacy-policy')
  }

  get termsOfServicesUrl$() : Observable<string> {
    return this.projectService.routeRelativeToCurrentProject$('terms-of-services')
  }

  get showPasswordsMismatched(): boolean {
    return !!this.form?.get('passwordRepeat')?.getError('compare')
  }

  get showInvalidPhoneNumber(): boolean {
    return !!this.form?.get('telephoneNumber')?.hasError('phoneNumberInvalid')
  }

  get showShortPassword(): boolean {
    return !!this.form?.get('password')?.hasError('minlength')
  }

  get showLongPassword(): boolean {
    return !!this.form?.get('password')?.hasError('maxlength')
  }

  get showPasswordInvalid(): boolean {
    return !!this.form?.get('password')?.hasError('passwordInvalid') && !this.showShortPassword && !this.showLongPassword
  }

  get showEmailsMismatched(): boolean {
    return !!this.form?.get('emailRepeat')?.hasError('compare')
  }

  private formToUserRegistrationData(form: FormGroup): UserRegistrationData {
    const phoneNumber = form.get("telephoneNumber")?.value
    return {
      username: requireDefinedNotNull(form.get("username")?.value),
      firstname: requireDefinedNotNull(form.get("firstname")?.value),
      lastname: requireDefinedNotNull(form.get("lastname")?.value),
      email: requireDefinedNotNull(form.get("email")?.value),
      telephoneNumber: isDefinedNotEmpty(phoneNumber) ? phoneNumber : undefined,
      password: requireDefinedNotNull(form.get("password")?.value)
    }
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      this.notificationService.startLoading("NOTIFICATIONS.SENDING", true)
      this.userService.register(this.formToUserRegistrationData(form))
        .pipe(first())
        .subscribe({
          next: () => {
            this.notificationService.success("USER_REGISTRATION.SUCCESS", true)
            this.router.navigate(["/login"])
            this.notificationService.stopLoading()
          },
          error: () => {
            this.notificationService.failure("USER_REGISTRATION.FAILURE", true)
            this.notificationService.stopLoading()
          }
        })
    } else {
      form.markAllAsTouched()
    }
  }
}
