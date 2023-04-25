import {ControlValueAccessor, FormControl, NgControl} from "@angular/forms";
import {Component, Input, OnChanges, OnInit, Optional, Self, SimpleChanges} from "@angular/core";
import {AdvertisementHelpType} from "../../../models/advertisement/advertisement-help-type";
import {Nullable} from "../../../shared/types/common";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {isObjectNotNullOrUndefined} from "../../../shared/predicates/object-predicates";

type AdvertisementHelpTypeSelectComponentValue = Nullable<AdvertisementHelpType[] | AdvertisementHelpType>

@UntilDestroy()
@Component({
  selector: 'app-advertisement-help-type-select',
  templateUrl: 'advertisement-help-type-select.component.html',
  styleUrls: ['advertisement-help-type-select.component.scss'],
})
export class AdvertisementHelpTypeSelectComponent implements ControlValueAccessor, OnInit, OnChanges {
  value: AdvertisementHelpTypeSelectComponentValue = null
  private onChange?: (value: AdvertisementHelpTypeSelectComponentValue) => void
  private onTouched?: () => void
  formControl: FormControl<AdvertisementHelpTypeSelectComponentValue>
    = new FormControl<AdvertisementHelpTypeSelectComponentValue>(null);

  /**
   * Types of help available to be set
   *
   * <p>By default, all known types are available</p>
   */
  @Input() availableAdvertisementHelpTypes: AdvertisementHelpType[] = Object.values(AdvertisementHelpType)

  @Input() allowMultiple: boolean = true

  @Input() label: string = ''
  @Input() placeholder: string = ''
  @Input() hint: string = ''


  constructor(@Optional() @Self() private ngControl: NgControl) {
    if (isObjectNotNullOrUndefined(this.ngControl)) {
      this.ngControl.valueAccessor = this
    }
  }

  private checkValidityForParent() {
    if (this.ngControl.invalid) {
      this.formControl.setErrors(this.ngControl.errors)
    }
    if (this.ngControl.touched) {
      //This way I can make sure that whenever error should be displayed, it really will be displayed
      this.formControl.markAsTouched()
    }
  }

  ngOnInit() {
    this.formControl.setValidators(this.ngControl.validator ?? null)
    this.formControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((value: AdvertisementHelpTypeSelectComponentValue) => {
        this.value = value
        this.onChange?.(this.value)
        this.onTouched?.()
      })
    this.ngControl.statusChanges?.pipe(untilDestroyed(this))
      .subscribe(_ => {
        //Make sure that everytime parent validity changes, we know about it
        this.checkValidityForParent()
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkValidityForParent()
  }


  compareHelpTypes(first: AdvertisementHelpType, second: AdvertisementHelpType) {
    return first === second
  }

  writeValue(value: Nullable<AdvertisementHelpType[]>) {
    this.value = value
    this.formControl.patchValue(value)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable()
    }
    this.formControl.enable()
  }

  getAdvertisementHelpTypeTranslationKey(advertisementHelpType: AdvertisementHelpType) {
    return `ADVERTISEMENT.HELP_TYPE.${advertisementHelpType.toUpperCase()}.NAME_B`
  }

  clearAdvertisementHelpType(event: MouseEvent) {
    this.formControl.patchValue(null)
    //Make sure that selection list won't open
    event.stopPropagation()
  }
}
