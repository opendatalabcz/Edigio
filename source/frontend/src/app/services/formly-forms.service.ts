import { Injectable } from '@angular/core';
import {MaxLessThanMinError} from "../errors/max-less-than-min-error";
import {AbstractControl, ValidatorFn, Validators} from "@angular/forms";
import {
  isNullOrUndefined
} from "../utils/predicates/object-predicates";
import {FieldTypeConfig, FormlyFieldConfig} from "@ngx-formly/core";
import {FormlyDatepickerFieldConfig} from "@ngx-formly/material/datepicker";

export interface BaseInputSettings {
  key: string
  label?: string
  placeholder?: string
  description?: string
  required?: boolean
}

export interface TextInputSettings extends BaseInputSettings{
  minLength?: number
  maxLength?: number,
  pattern?: RegExp
}

export interface DateInputSettings extends BaseInputSettings {
  minDate?: Date,
  maxDate?: Date
}

export interface SelectInputSettings extends BaseInputSettings {
  options: { value: any, label: string, disabled?: boolean }[]
  allowMultipleSelected?: boolean
}

export type FilterFormValidationType = (control: AbstractControl) => boolean

export type BeforeAfterDatesPair = {before?: Date, after?: Date}

@Injectable({
  providedIn: 'root'
})
export class FormlyFormsService {

  protected initConfig(params: BaseInputSettings) : FormlyFieldConfig {
    const {
      key,
      label = '',
      placeholder = '',
      description = '',
      required = false,
    } = params
    return {
      key,
      props: {label, placeholder, description, required}
    }
  }

  public createTextInput(params: TextInputSettings) : FormlyFieldConfig {
    const {
      minLength = 0,
      maxLength,
      pattern
    } = params
    if (maxLength && maxLength < minLength) {
      throw new MaxLessThanMinError(
        minLength,
        maxLength,
        "Input length boundaries"
      )
    }
    const inits = this.initConfig(params)
    return {
      ...inits,
      type: 'input',
      wrappers: ['form-field'],
      props: {
        ...inits.props,
        minLength,
        maxLength,
        pattern
      }
    }
  }

  public createDateInput(params: DateInputSettings) : FormlyFieldConfig {
    const inits = this.initConfig(params)
    return <FormlyDatepickerFieldConfig>{
      ...inits,
      type: 'datepicker',
      props: {
        ...inits.props,
        datepickerOptions: {
          min: params.minDate,
          max: params.maxDate,
        }
      }
    }
  }

  private createBeforeEarlierThanAfterValidator(extractDatesFromModel: ( model: any) => BeforeAfterDatesPair,
                                                message?: string,
  ) : FilterFormValidationType {
    return (control: AbstractControl) => {
      console.dir(control.value)
      const value = extractDatesFromModel(control.value)
      return (
        isNullOrUndefined(value.after) || isNullOrUndefined(value.before)
      || value.before!.getTime() >= value.after!.getTime())
    }
  }

  public createAfterBeforeInput(afterInputParams: DateInputSettings,
                                beforeInputParams: DateInputSettings,
                                extractDatesFromModel: ( model: any) => BeforeAfterDatesPair,
                                errorMessage?: string)
    : FormlyFieldConfig {

    const afterInput = this.createDateInput(afterInputParams)
    const beforeInput = this.createDateInput(beforeInputParams)

    return {
      validators: {
        beforeAfter: {
          expression: this.createBeforeEarlierThanAfterValidator(extractDatesFromModel),
          message: "err"
        }
      },
      props: {
        label: "Časové rozmezí"
      },
      fieldGroup: [afterInput, beforeInput]
    }
  }

  public createSelectInput(params: SelectInputSettings) {
    const inits = this.initConfig(params)
    return {
      ...inits,
      type: 'select',
      props: {
        ...inits.props,
        options: params.options,
        multiple: params.allowMultipleSelected
      }
    }
  }
}
