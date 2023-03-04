import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../models/common/contact";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

interface PublishedContactDetailsFormControls {
  lastname: FormControl<boolean>,
  email: FormControl<boolean>,
  telephoneNumber: FormControl<boolean>
}

@UntilDestroy()
@Component({
  selector: 'app-published-contact-settings-details',
  templateUrl: './published-contact-details-settings.component.html',
  styleUrls: ['./published-contact-details-settings.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PublishedContactDetailsSettingsComponent),
      multi: true
    }
  ]
})
export class PublishedContactDetailsSettingsComponent implements ControlValueAccessor, OnInit {
  private _value: PublishedContactDetailSettings = {
    lastname: false,
    email: false,
    telephoneNumber: false
  }

  private set value(settings: PublishedContactDetailSettings) {
    this._value = settings
  }

  private isDisabled: boolean = false;
  private onTouch?: () => void
  private onChange?: (settings: PublishedContactDetailSettings) => void

  form?: FormGroup<PublishedContactDetailsFormControls>

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      lastname: this._value.lastname,
      email: this._value.email,
      telephoneNumber: this._value.telephoneNumber
    })
    this.form.valueChanges
      .subscribe(updatedValue => {
        const {lastname = false, email = false, telephoneNumber = false} = updatedValue
        this.value = {lastname, email, telephoneNumber}
      })
  }


  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  writeValue(obj: PublishedContactDetailSettings): void {
    this.form?.patchValue(obj)
  }
}
