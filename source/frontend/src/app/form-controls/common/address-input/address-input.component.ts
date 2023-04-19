import {Component, forwardRef, Input, OnInit, Optional} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Address} from "../../../models/common/address";
import {Nullable} from "../../../shared/types/common";
import {isDefinedNotBlank} from "../../../shared/predicates/string-predicates";

/**
 * Level of detail up to which address should be required
 */
export enum AddressDetailLevel {
  NONE, COUNTRY, REGION, CITY, STREET, POSTAL_CODE, HOUSE_NUMBER
}

export interface AddressInputFieldsHints {
  country?: string
  region?: string
  city?: string
  street?: string
  houseNumber?: string
  postalCode?: string
}

export interface AddressInputControls {
  country?: FormControl<Nullable<string>>
  region?: FormControl<Nullable<string>>
  city?: FormControl<Nullable<string>>
  street?: FormControl<Nullable<string>>
  houseNumber?: FormControl<Nullable<string>>
  postalCode?: FormControl<Nullable<string>>
}

/**
 * Input component for address, that is checked out in cooperation with server side part of the app
 */
@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressInputComponent),
      multi: true
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor, OnInit {
  /**
   * Minimal (required) level of retrieved address detail.
   *
   * <p>Fields are rendered up to given address part</p>
   * <p>
   *   Details goes in this sequence:
   *   <ol>
   *     <li>{@link AddressDetailLevel.NONE}</li>
   *     <li>{@link AddressDetailLevel.COUNTRY}</li>
   *     <li>{@link AddressDetailLevel.REGION}</li>
   *     <li>{@link AddressDetailLevel.CITY}</li>
   *     <li>{@link AddressDetailLevel.STREET}</li>
   *     <li>{@link AddressDetailLevel.POSTAL_CODE}</li>
   *     <li>{@link AddressDetailLevel.HOUSE_NUMBER}</li>
   *   </ol>
   * </p>
   * <p>For example, when {@link AddressDetailLevel.REGION} is given, Country + Region is being retrieved </p>
   */
  @Input() addressMinDetail: AddressDetailLevel = AddressDetailLevel.HOUSE_NUMBER

  /**
   * Maximal level of retrieved address detail (everything not in {@link addressMinDetail} is optional).
   *
   * <p>Fields are rendered up to given address part</p>
   * <p>
   *   Details go in this sequence:
   *   <ol>
   *     <li>{@link AddressDetailLevel.NONE}</li>
   *     <li>{@link AddressDetailLevel.COUNTRY}</li>
   *     <li>{@link AddressDetailLevel.REGION}</li>
   *     <li>{@link AddressDetailLevel.CITY}</li>
   *     <li>{@link AddressDetailLevel.STREET}</li>
   *     <li>{@link AddressDetailLevel.POSTAL_CODE}</li>
   *     <li>{@link AddressDetailLevel.HOUSE_NUMBER}</li>
   *   </ol>
   * </p>
   * <p>For example, when {@link AddressDetailLevel.REGION} is given, Country + Region is being retrieved </p>
   *
   * <p><b>BEWARE:</b> Shouldn't be less restrictive than addressMinDetail</p>
   */
  @Input() addressMaxDetail: AddressDetailLevel = AddressDetailLevel.HOUSE_NUMBER

  /**
   * Hints for individual inputs
   */
  @Input() hints: AddressInputFieldsHints = {};

  onChange?: (address: Address) => void

  onTouched?: () => void

  isDisabled = false

  private value: Address = {}

  parentForm?: FormGroup

  form?: FormGroup

  controls: AddressInputControls = {}

  /**
   * Name of group that will be added to parent form (if provided)
   */
  @Input() parentFormGroupName?: string

  constructor(private fb: FormBuilder,
              @Optional() private parentGroupDirective?: FormGroupDirective) {
  }

  ngOnInit() {
    this.parentForm = this.parentGroupDirective?.form
    this.controls = {
      country: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.COUNTRY)),
      region: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.REGION)),
      city: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.CITY)),
      street: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.STREET)),
      postalCode: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.POSTAL_CODE)),
      houseNumber: this.fb.control(null, this.getValidatorsForLastInputWithDetailLevel(AddressDetailLevel.HOUSE_NUMBER))
    }
    this.form = this.fb.group(this.controls)
    if (this.parentForm) {
      if (!isDefinedNotBlank(this.parentFormGroupName)) {
        console.warn('Warning, parent form group provided without parentFormGroupName! Used default instead!')
        this.parentFormGroupName = 'address'
      }
      this.parentForm.addControl(this.parentFormGroupName, this.form)
    }
  }

  private getValidatorsForLastInputWithDetailLevel(detailsLevel: AddressDetailLevel): Nullable<ValidatorFn[]> {
    return detailsLevel <= this.addressMinDetail ? [Validators.required] : null
  }

  get shouldDisplayCountryInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.COUNTRY
  }

  get shouldDisplayRegionInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.REGION
  }

  get shouldDisplayCityInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.CITY
  }

  get shouldDisplayStreetInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.STREET
  }

  get shouldDisplayPostalCodeInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.POSTAL_CODE
  }

  get shouldDisplayHouseNumberInput(): boolean {
    return this.addressMaxDetail >= AddressDetailLevel.HOUSE_NUMBER
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  writeValue(value: Address): void {
    this.value = value
  }
}
