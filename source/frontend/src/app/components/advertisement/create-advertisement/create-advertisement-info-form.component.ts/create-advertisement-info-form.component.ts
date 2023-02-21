import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AdvertisementType} from "../../../../models/advertisement/advertisement";
import {requireDefinedNotNull, requireNotNull} from "../../../../utils/assertions/object-assertions";
import {requireDefinedNotEmpty} from "../../../../utils/assertions/array-assertions";

interface CreateAdvertisementInfoFormControlsNames {
  advertisementType: string
  advertisementTitle: string
  advertisementDescription: string
  primaryLanguage: string
  currentLanguage: string
}

interface CreateAdvertisementInfoFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<string, string>,
  advertisementDescription: AbstractControl<string, string>
  primaryLanguage: AbstractControl<string, string>,
  currentLanguage: AbstractControl<string, string>
}

@Component({
  selector: 'app-create-advertisement-info-form',
  templateUrl: './create-advertisement-info-form.component.html',
  styleUrls: ['./create-advertisement-info-form.component.scss']
})
export class CreateAdvertisementInfoFormComponent implements OnInit {

  readonly formControlsNames: CreateAdvertisementInfoFormControlsNames = {
    advertisementType: 'advertisementType',
    advertisementTitle: 'title',
    advertisementDescription: 'description',
    currentLanguage: 'currentLanguage',
    primaryLanguage: 'primaryLanguage'
  };

  private _form?: FormGroup;

  @Input() set form(value: FormGroup) {
    this._form = value
  }

  get form(): FormGroup {
    return requireDefinedNotNull(this._form, 'Create advertisement info form must be initialized before use!')
  }

  private _formControls?: CreateAdvertisementInfoFormControls
  get formControls(): CreateAdvertisementInfoFormControls {
    return requireDefinedNotNull(
      this._formControls, 'Create advertisement info form control must not be null when used!"'
    )
  }

  constructor(private fb: FormBuilder) {
  }


  ngOnInit() {
    this.setupForm()
  }

  private setupForm(): void {
    const form = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(AdvertisementType.OFFER),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control('', [Validators.required]),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(''),
      [this.formControlsNames.primaryLanguage]: this.fb.nonNullable.control('cs'),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control('cs'),
    })
    this._formControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType)),
      advertisementTitle: requireNotNull(form.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(form.get(this.formControlsNames.advertisementDescription)),
      primaryLanguage: requireNotNull(form.get(this.formControlsNames.primaryLanguage)),
      currentLanguage: requireNotNull(form.get(this.formControlsNames.currentLanguage))
    }
  }

  onSubmit() {
    console.log(this.formControls.advertisementTitle.value)
  }
}
