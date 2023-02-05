import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../../utils/predicates/object-predicates";

@Component({
  selector: 'app-multilingual-text-input',
  templateUrl: './multilingual-text-input.component.html',
  styleUrls: ['./multilingual-text-input.component.scss']
})
export class MultilingualTextInputComponent implements ControlValueAccessor, OnInit {
  @Input() color: 'primary' | 'accent' | 'warning' = 'primary'

  private _languages?: string[]

  get languages() : string[] {
    if(isNullOrUndefined(this._languages)) {
      throw new Error('Languages not set!')
    }
    return this._languages
  }
  @Input() set languages(langs: string[]) {
    if(this._defaultLanguage !== undefined && langs.indexOf(this.defaultLanguage) < 0) {
      throw new Error("Default language is not available in given langs list!")
    }
    if(this._selectedLanguage !== undefined && langs.indexOf(this.selectedLanguage) < 0) {
      throw new Error("Selected language is not available in given langs list!")
    }
    this._languages = langs
  }

  private _defaultLanguage?: string
  get defaultLanguage(): string {
    if(isNullOrUndefined(this._defaultLanguage)) {
      throw new Error('Languages not set!')
    }
    return this._defaultLanguage
  }
  @Input() set defaultLanguage(lang: string) {
    if(this._languages !== undefined && this.languages.indexOf(lang) < 0) {
      throw new Error("Default language is not available in langs list!")
    }
    this._defaultLanguage = lang
  }

  private _selectedLanguage?: string;
  get selectedLanguage(): string {
    if(isNullOrUndefined(this._selectedLanguage)) {
      throw new Error('No language is selected!')
    }
    return this._selectedLanguage
  }
  @Input() set selectedLanguage(lang: string) {
    if(this._languages !== undefined && this.languages.indexOf(lang) < 0) {
      throw new Error("Selected language is not available in given langs list!")
    }
    this._selectedLanguage = lang
  }

  get inputLanguagesAlreadySetup() {
    return isNotNullOrUndefined(this._languages) && isNotNullOrUndefined(this._defaultLanguage)
  }

  ngOnInit(): void {
    if(!this.inputLanguagesAlreadySetup) {
      throw new Error('Languages and default language for control not set valid!')
    }
    this.selectedLanguage = this.defaultLanguage
  }

  onSelectedLangChanges(lang: string) {
    console.log('Language ' + lang + ' selected')
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: any): void {
  }
}
