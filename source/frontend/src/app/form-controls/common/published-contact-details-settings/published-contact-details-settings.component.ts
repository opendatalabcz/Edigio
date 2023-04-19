import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../models/common/contact";
import {UntilDestroy} from "@ngneat/until-destroy";

interface PublishedContactDetailsFormControls {
  firstname: FormControl<boolean>,
  lastname: FormControl<boolean>,
  email: FormControl<boolean>,
  telephoneNumber: FormControl<boolean>
}

/**
 * Settings of one field in {@link PublishedContactDetailsSettingsComponentSettings}
 */
export interface PublishedContactDetailsSettingsComponentFieldSettings {
  /**
   * Should the field be shown?
   */
  show: boolean
  /**
   * Should the field be editable? When field is not shown, this value is omitted
   */
  editable: boolean
}

/**
 * Settings of all fields in {@link PublishedContactDetailsSettingsComponentSettings}
 */
export interface PublishedContactDetailsSettingsComponentSettings {
  firstname?: PublishedContactDetailsSettingsComponentFieldSettings
  lastname?: PublishedContactDetailsSettingsComponentFieldSettings
  email?: PublishedContactDetailsSettingsComponentFieldSettings
  telephoneNumber?: PublishedContactDetailsSettingsComponentFieldSettings
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
  @Input() settings: PublishedContactDetailsSettingsComponentSettings = {}


  private value?: PublishedContactDetailSettings

  private isDisabled: boolean = false;
  private onTouch?: () => void
  private onChange?: (settings: PublishedContactDetailSettings) => void

  form?: FormGroup<PublishedContactDetailsFormControls>

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      firstname: {
        //When no value is given for settings, I always expect the
        value: this.value?.firstname ?? false,
        disabled: !(this.firstnameEditable())
      },
      lastname: {
        value: this.value?.lastname ?? false,
        disabled: !(this.lastnameEditable())
      },
      email: {
        value: this.value?.email ?? false,
        disabled: !(this.emailEditable())
      },
      telephoneNumber: {
        value: this.value?.telephoneNumber ?? false,
        disabled: !(this.telephoneNumberEditable())
      },
    })
    this.form.valueChanges
      .subscribe(updatedValue => {
        this.value = this.createDetailsSettingsFromFormValue(updatedValue)
        this.onChange?.(this.value)
        this.onTouch?.()
      })
  }

  private firstnameEditable(): boolean {
    return (this.settings?.firstname?.editable ?? true)
  }

  private lastnameEditable(): boolean {
    return (this.settings?.lastname?.editable ?? true)
  }

  private emailEditable(): boolean {
    return (this.settings?.email?.editable ?? true)
  }

  private telephoneNumberEditable(): boolean {
    return (this.settings?.email?.editable ?? true)
  }

  private createDetailsSettingsFromFormValue(value: PublishedContactDetailSettings) {
    const firstname = this.firstnameEditable() ? (value.firstname ?? false) : this.value?.firstname
    const lastname = this.lastnameEditable() ? (value.lastname ?? false) : this.value?.lastname
    const email = this.emailEditable() ? (value.email ?? false) : this.value?.email
    const telephoneNumber
      = this.telephoneNumberEditable() ? (value.telephoneNumber ?? false) : this.value?.telephoneNumber
    return {
      firstname,
      lastname,
      email,
      telephoneNumber,
    }
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
    this.value = obj
    this.form?.patchValue(obj)
  }
}
