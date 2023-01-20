import {Injectable} from '@angular/core';
import {MaxLessThanMinError} from "../errors/max-less-than-min-error";
import {AbstractControl} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {FormlyDatepickerFieldConfig} from "@ngx-formly/material/datepicker";
import {Observable} from "rxjs";

export interface BaseInputSettings {
  key: string
  label?: string | Observable<string | undefined>
  placeholder?: string | Observable<string | undefined>
  description?: string | Observable<string | undefined>
  required?: boolean
}

export interface TextInputSettings extends BaseInputSettings {
  minLength?: number
  maxLength?: number,
  pattern?: RegExp
}

export interface DateInputSettings extends BaseInputSettings {
  minDate?: Date,
  maxDate?: Date
}

export interface SelectInputOption<T> {
  value: T,
  label: string | Observable<unknown>,
  disabled?: boolean
}

export interface SelectInputSettings extends BaseInputSettings {
  options: SelectInputOption<unknown>[] | Observable<SelectInputOption<unknown>[]>
  allowMultipleSelected?: boolean
}

export type FilterFormValidationType = (control: AbstractControl) => boolean


export type BeforeAfterDatesPair = { before?: Date, after?: Date }

@Injectable({
  providedIn: 'root'
})
export class FormlyFormsService {

  protected resolvePossiblyObservableValue<T>(value: T | Observable<T | undefined>): T | undefined {
    return value instanceof Observable<unknown | undefined> ? undefined : value
  }

  protected initConfig(params: BaseInputSettings): FormlyFieldConfig {
    const {
      key,
      label = '',
      placeholder = '',
      description = '',
      required = false,
    } = params
    const result: FormlyFieldConfig = {
      key,
      props: {
        label: this.resolvePossiblyObservableValue(label),
        placeholder: this.resolvePossiblyObservableValue(placeholder),
        description: this.resolvePossiblyObservableValue(description),
        required
      }
    }
    result.expressions = {
      ...(result.props?.label === undefined && {'props.label': label}),
      ...(result.props?.placeholder === undefined && {'props.placeholder': placeholder}),
      ...(result.props?.description === undefined && {'props.description': description}),
    }
    return result
  }

  public createTextInput(params: TextInputSettings): FormlyFieldConfig {
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

  public createDateInput(params: DateInputSettings): FormlyFieldConfig {
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

  private createBeforeEarlierThanAfterValidator<T>(extractDatesFromModel: (model: T) => BeforeAfterDatesPair)
    : FilterFormValidationType {
    return (control: AbstractControl) => {
      console.dir(control.value)
      const value = extractDatesFromModel(control.value)
      return (value.after === undefined || value.after === null || value.before === undefined || value.before === null
        || value.before.getTime() >= value.after.getTime())
    }
  }

  public createAfterBeforeInput<T>(afterInputParams: DateInputSettings,
                                beforeInputParams: DateInputSettings,
                                extractDatesFromModel: (model: T) => BeforeAfterDatesPair)
    : FormlyFieldConfig {

    const afterInput = this.createDateInput(afterInputParams)
    const beforeInput = this.createDateInput(beforeInputParams)

    return {
      validators: {
        beforeAfter: {
          expression: this.createBeforeEarlierThanAfterValidator(extractDatesFromModel)
        }
      },
      props: {
        label: "Časové rozmezí"
      },
      fieldGroup: [afterInput, beforeInput]
    }
  }

  public createSelectInput(params: SelectInputSettings): FormlyFieldConfig {
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
