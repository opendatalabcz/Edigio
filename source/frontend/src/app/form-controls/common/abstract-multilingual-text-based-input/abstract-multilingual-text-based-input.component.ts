import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl} from "@angular/forms";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {untilDestroyed} from "@ngneat/until-destroy";
import {Nullable} from "../../../shared/types/common";
import {anyMatch} from "../../../shared/utils/array-utils";
import {isDefinedNotBlank} from "../../../shared/predicates/string-predicates";
import {distinctUntilChanged} from "rxjs";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {languageInList} from "../../../shared/predicates/language-utils";

@Component({
  template: ''
})
export abstract class AbstractMultilingualTextBasedInputComponent implements ControlValueAccessor, OnInit, OnChanges {
  readonly EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY = 'defaultLangEmpty'
  textControl = new FormControl('')

  @Input() color: 'primary' | 'accent' | 'warning' = 'primary'

  @Input() hint: string = ''
  @Input() label: string = ''
  @Input() placeholder: string = ''

  @Input() removeEmptyTextLanguages: boolean = false

  @Input() emptyTextErrorTranslationKey: string = "FORMS.ERRORS.MULTILINGUAL_INPUT.REQUIRED_LANGUAGE_EMPTY"

  protected onChange?: (value: MultilingualText) => void

  protected onTouch?: () => void

  isEnabled = true


  private _languages?: readonly ReadOnlyLanguage[]
  get languages(): readonly ReadOnlyLanguage[] {
    if (isObjectNullOrUndefined(this._languages)) {
      throw new Error('Languages not set!')
    }
    return this._languages
  }

  @Input() set languages(langs: readonly ReadOnlyLanguage[]) {
    //First let's make sure default language is available to fill up
    if (this._defaultLanguage !== undefined && !languageInList(langs, this.defaultLanguage)) {
      throw new Error("Default language is not available in given langs list!")
    }
    //Now let's make sure currently selected language is in list, otherwise we wouldn't know what  to do
    if (this._selectedLanguage !== undefined && !languageInList(langs, this.selectedLanguage)) {
      throw new Error("Selected language is not available in given langs list!")
    }
    this._languages = langs
  }

  private _defaultLanguage?: ReadOnlyLanguage
  get defaultLanguage(): ReadOnlyLanguage {
    if (isObjectNullOrUndefined(this._defaultLanguage)) {
      throw new Error('Languages not set!')
    }
    return this._defaultLanguage
  }

  @Input() set defaultLanguage(lang: ReadOnlyLanguage) {
    if (this._languages !== undefined && !this.languages.find(it => it.code === lang.code)) {
      throw new Error("Default language is not available in langs list!")
    }
    this._defaultLanguage = lang
    if(isObjectNotNullOrUndefined(this._value)) {
      this._value.setDefaultLanguage(lang.code, true, true)
    }
    if (!this._selectedLanguage) {
      //Default language should be first to be selected,
      // as it makes most sense to edit it first
      this.selectedLanguage = lang
    }
    if (this._value) {
      this.validate(this.textControl)
      this.onChange?.(this._value)
    }
  }

  private _selectedLanguage?: ReadOnlyLanguage;
  get selectedLanguage(): ReadOnlyLanguage {
    if (isObjectNullOrUndefined(this._selectedLanguage)) {
      throw new Error('No language is selected!')
    }
    return this._selectedLanguage
  }

  @Input() set selectedLanguage(lang: ReadOnlyLanguage) {
    const verifyAndAssign = (langToSet: ReadOnlyLanguage) => {
      //Make sure that selected language is really available
      if (this._languages !== undefined && !this.languages.find(lang => lang.code === langToSet.code)) {
        throw new Error("Selected language is not available in given langs list!")
      }
      this._selectedLanguage = langToSet
      if (this.textControl) {
        this.textControl.patchValue(this._value?.findTextForLanguage(lang.code)?.text ?? '')
      }
    }
    verifyAndAssign(lang)
  }

  @Input() languageSelectionEnabled: boolean = false;


  _requiredLanguages: readonly ReadOnlyLanguage[] = []
  @Input() set requiredLanguages(langs: readonly ReadOnlyLanguage[]) {
    this._requiredLanguages = langs
    if (this._value) {
      this.onChange?.(this._value)
    }
  }

  get requiredLanguages(): readonly ReadOnlyLanguage[] {
    return this._requiredLanguages
  }

  private _value?: MultilingualText

  get inputLanguagesAlreadySetup() {
    return isObjectNotNullOrUndefined(this._languages) && isObjectNotNullOrUndefined(this._defaultLanguage)
  }

  private set value(multilingualText: MultilingualText) {
    this._value = multilingualText
  }

  private isLanguageRequired(lang: ReadOnlyLanguage) {
    return this.requiredLanguages.includes(lang)
  }

  private setCurrentLanguageText(newValue: Nullable<string>) {
    if (isObjectNullOrUndefined(this._value)) {
      return
    }

    if (!newValue && (this.selectedLanguage === this.defaultLanguage || this.isLanguageRequired(this.selectedLanguage))) {
      this._value.setTextForLang(this.selectedLanguage.code, "")
    } else if (!newValue && this.removeEmptyTextLanguages) {
      this._value.removeTextForLang(this.selectedLanguage.code)
    } else {
      this._value.setTextForLang(this.selectedLanguage.code, newValue ?? '')
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
      languageCode: this.defaultLanguage.code,
      text: ''
    }, ...(this.languages
      .filter(lang => lang.code.localeCompare(this.defaultLanguage.code))
      .map(lang => ({languageCode: lang.code, text: ''}))))
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

  onSelectedLangChanges(lang: ReadOnlyLanguage) {
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
    this.value = obj
    if (this._selectedLanguage) {
      this.textControl.patchValue(obj.findTextForLanguage(this.selectedLanguage.code)?.text ?? '')
    }
  }

  validate(_control: FormControl) {
    const valid = !anyMatch(
      this.requiredLanguages,
      (lang: ReadOnlyLanguage) => !isDefinedNotBlank(this._value?.findTextForLanguage(lang.code)?.text)
    )
    if (!valid) {
      this.textControl.setErrors({
        [this.EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY]: true
      })
    } else if (this.textControl.errors) {
      //When errors object is not null, control is handled as if it were in error state,
      // therefore it's needed to set errors object to null, when there is no error.
      //At current state, there shouldn't be any other error on text control, so we can simply set it to null,
      // when control is valid
      this.textControl.setErrors(null)
    }
    return !valid && {
      'default_lang_empty': true
    }
  }

  get isEmptyDefaultLanguageTextEmptyError(): boolean {
    return this.textControl.hasError(this.EMPTY_DEFAULT_LANGUAGE_TEXT_ERROR_KEY)
  }

  ngOnChanges() {
    this.validate(this.textControl)
  }

  languageComparator(first?: ReadOnlyLanguage, second?: ReadOnlyLanguage): boolean {
    return (!first && !second) || (!!first && !!second && first.code === second.code)
  }
}
