import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, FormControl} from "@angular/forms";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {untilDestroyed} from "@ngneat/until-destroy";
import {Nullable} from "../../../utils/types/common";
import {anyMatch} from "../../../utils/array-utils";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {distinctUntilChanged} from "rxjs";

@Component({template: ''})
export abstract class AbstractMultilingualTextBasedInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  readonly EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY = 'defaultLangEmpty'
  textControl = new FormControl('')

  @Input() color: 'primary' | 'accent' | 'warning' = 'primary'

  @Input() hint: string = ''
  @Input() label: string = ''
  @Input() placeholder: string = ''

  @Input() removeEmptyTextLanguages: boolean = false

  @Input() forceErrorMsgIfExists: boolean = false

  @Input() emptyTextErrorTranslationKey: string = "FORMS.ERRORS.MULTILINGUAL_INPUT.REQUIRED_LANGUAGE_EMPTY"

  protected onChange?: (value: MultilingualText) => void

  protected onTouch?: () => void

  isEnabled = true


  private _languages?: string[]
  get languages(): string[] {
    if (isObjectNullOrUndefined(this._languages)) {
      throw new Error('Languages not set!')
    }
    return this._languages
  }

  @Input() set languages(langs: string[]) {
    if (this._defaultLanguage !== undefined && langs.indexOf(this.defaultLanguage) < 0) {
      throw new Error("Default language is not available in given langs list!")
    }
    if (this._selectedLanguage !== undefined && langs.indexOf(this.selectedLanguage) < 0) {
      throw new Error("Selected language is not available in given langs list!")
    }
    this._languages = langs
  }

  private _defaultLanguage?: string
  get defaultLanguage(): string {
    if (isObjectNullOrUndefined(this._defaultLanguage)) {
      throw new Error('Languages not set!')
    }
    return this._defaultLanguage
  }

  @Input() set defaultLanguage(lang: string) {
    if (this._languages !== undefined && this.languages.indexOf(lang) < 0) {
      throw new Error("Default language is not available in langs list!")
    }
    this._defaultLanguage = lang
    if (!this._selectedLanguage) {
      //Default language should be first to be selected,
      // as it makes most sense to edit it first
      this.selectedLanguage = lang
    }
  }

  private _selectedLanguage?: string;
  get selectedLanguage(): string {
    if (isObjectNullOrUndefined(this._selectedLanguage)) {
      throw new Error('No language is selected!')
    }
    return this._selectedLanguage
  }

  @Input() set selectedLanguage(lang: string) {
    const verifyAndAssign = (langToSet: string) => {
      //Make sure that selected language is really available
      if (this._languages !== undefined && this.languages.indexOf(langToSet) < 0) {
        throw new Error("Selected language is not available in given langs list!")
      }
      this._selectedLanguage = langToSet
      if (this.textControl) {
        this.textControl.patchValue(this._value?.findTextForLanguage(lang)?.text ?? '')
      }
    }
    verifyAndAssign(lang)
  }

  @Input() languageSelectionEnabled: boolean = false;


  @Input() requiredLanguages: string[] = []

  private _value?: MultilingualText

  get inputLanguagesAlreadySetup() {
    return isObjectNotNullOrUndefined(this._languages) && isObjectNotNullOrUndefined(this._defaultLanguage)
  }

  private set value(multilingualText: MultilingualText) {
    this._value = multilingualText
  }

  private isLanguageRequired(lang: string) {
    return this.requiredLanguages.includes(lang)
  }

  private setCurrentLanguageText(newValue: Nullable<string>) {
    if (isObjectNullOrUndefined(this._value)) {
      return
    }

    if (!newValue && (this.selectedLanguage === this.defaultLanguage || this.isLanguageRequired(this.selectedLanguage))) {
      this._value.setTextForLang(this.selectedLanguage, "")
    } else if (!newValue && this.removeEmptyTextLanguages) {
      console.log('Removing ', this.selectedLanguage, ' text :)')
      this._value.removeTextForLang(this.selectedLanguage)
    } else {
      this._value.setTextForLang(this.selectedLanguage, newValue ?? '')
    }
    if (this.onChange) {
      this.onChange(this._value)
    }
  }

  ngOnInit(): void {
    if (!this.inputLanguagesAlreadySetup) {
      throw new Error('Languages and default language for control not set valid!')
    }
    this.value = MultilingualText.of({
      lang: this.defaultLanguage,
      text: ''
    }, ...(this.languages
      .filter(lang => lang.localeCompare(this.defaultLanguage))
      .map(lang => ({lang, text: ''}))))
    this.textControl.valueChanges
      .pipe(
        distinctUntilChanged((prev, current) => {
          return prev === current
        }),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.setCurrentLanguageText(value)
        this.onTouch?.()
      })
  }

  onSelectedLangChanges(lang: string) {
    this.selectedLanguage = lang
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = () => {
      this.validate(this.textControl)
      fn()
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.isEnabled = !isDisabled
  }

  writeValue(obj: MultilingualText): void {
    console.log('Writtin', obj)
    //Everything is checked in setter, so there's no need to do anything else :)
    this.value = obj
    if (this._selectedLanguage) {
      this.textControl.patchValue(obj.findTextForLanguage(this.selectedLanguage)?.text ?? '')
    }
  }

  validate(_control: FormControl) {
    const valid = !anyMatch(
      this.requiredLanguages,
      (lang: string) => !isDefinedNotBlank(this._value?.findTextForLanguage(lang)?.text)
    )
    if (!valid) {
      this.textControl.setErrors({
        [this.EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY]: true
      })
    } else if (this.textControl.errors) {
      delete this.textControl.errors[this.EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY]
    }
    return !valid && {
      'default_lang_empty': true
    }
  }

  get isEmptyDefaultLanguageTextEmptyError(): boolean {
    return this.textControl.hasError(this.EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY)
  }

  ngOnChanges() {
    if (this.forceErrorMsgIfExists) {
      this.validate(this.textControl)
    }
  }
}
