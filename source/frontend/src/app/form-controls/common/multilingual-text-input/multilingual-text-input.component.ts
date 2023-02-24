import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {LocalizedText, MultilingualText} from "../../../models/common/multilingual-text";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {Nullable} from "../../../utils/types/common";
import {isArrayEmpty} from "../../../utils/array-utils";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {distinctUntilChanged} from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-multilingual-text-input',
  templateUrl: './multilingual-text-input.component.html',
  styleUrls: ['./multilingual-text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultilingualTextInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultilingualTextInputComponent),
      multi: true
    }
  ]
})
export class MultilingualTextInputComponent implements ControlValueAccessor, OnInit {
  textControl = new FormControl('')

  @Input() color: 'primary' | 'accent' | 'warning' = 'primary'

  @Input() hint: string = ''
  @Input() label: string = ''
  @Input() placeholder: string = ''

  @Input() removeEmptyTextLanguages: boolean = false

  private onChange?: (value: MultilingualText) => void

  private onTouch?: () => void

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
        this.textControl.setValue(this._value?.findTextForLanguage(lang)?.text ?? '')
      }
    }
    verifyAndAssign(lang)
  }

  @Input() languageSelectionEnabled: boolean = false;


  private _value?: MultilingualText

  get inputLanguagesAlreadySetup() {
    return isObjectNotNullOrUndefined(this._languages) && isObjectNotNullOrUndefined(this._defaultLanguage)
  }

  private set value(multilingualText: MultilingualText) {
    const languagesInGivenText = multilingualText.availableLanguages
    const missingLanguages = this.languages.filter(lang => languagesInGivenText.includes(lang))
    if (!isArrayEmpty(missingLanguages)) {
      console.warn("Given text doesn't contain some of languages available in control! Adding missing languages!")
    }
    this._value = multilingualText
  }

  private currentLanguageLocalizedText?: LocalizedText;

  private setCurrentLanguageText(newValue: Nullable<string>) {
    if(this._value) {
      this._value.setTextForLang(this.selectedLanguage, newValue ?? '')
      if(this.onChange) {
        this.onChange(this.value)
      }
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
    this.onTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isEnabled = !isDisabled
  }

  writeValue(obj: MultilingualText): void {
    //Everything is checked in setter, so there's no need to do anything else :)
    this.value = obj
  }



  validate(_control: FormControl) {
    const valid = isDefinedNotBlank(this._value?.findTextForLanguage(this.defaultLanguage)?.text)
    if(!valid) {
      console.log('not-valid')
      this.textControl.setErrors({'default_lang_empty': true})
    } else if(this.textControl.errors) {
      console.log('deleted')
      delete this.textControl.errors['default_lang_empty']
    }
    return !valid && {
      'default_lang_empty': true
    }
  }
}
