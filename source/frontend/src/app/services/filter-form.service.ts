import { Injectable } from '@angular/core';
import {BaseInputSettings, FormlyFormsService} from "./formly-forms.service";
import {FormlyFieldConfig} from "@ngx-formly/core";

@Injectable({
  providedIn: 'root'
})
export class FilterFormService extends FormlyFormsService{

  constructor() {
    super()
  }

  public static readonly FILTER_FORM_INPUT_CLASS = 'filter-form-input'

  protected override initConfig(params: BaseInputSettings) : FormlyFieldConfig {
    return {
      ...super.initConfig(params),
      className: FilterFormService.FILTER_FORM_INPUT_CLASS
    }
  }

}
