import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor} from "@angular/forms";
import {isObjectNotNullOrUndefined, isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-multilingual-text-input',
  templateUrl: './multilingual-text-input.component.html',
  styleUrls: ['./multilingual-text-input.component.scss']
})
export class MultilingualTextInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild("textValue") textInput?: ElementRef

  @Input() color: 'primary' | 'accent' | 'warning' = 'primary'

  isEnabled = true

  private _languages?: string[]

  get languages() : string[] {
    if(isObjectNullOrUndefined(this._languages)) {
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
    if(isObjectNullOrUndefined(this._defaultLanguage)) {
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
    if(isObjectNullOrUndefined(this._selectedLanguage)) {
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

  private value?: MultilingualText

  get inputLanguagesAlreadySetup() {
    return isObjectNotNullOrUndefined(this._languages) && isObjectNotNullOrUndefined(this._defaultLanguage)
  }

  ngOnInit(): void {
    if(!this.inputLanguagesAlreadySetup) {
      throw new Error('Languages and default language for control not set valid!')
    }
    this.selectedLanguage = this.defaultLanguage
    this.value = MultilingualText.of({
      lang: this.defaultLanguage,
      text: ''
    }, ...(this.languages
      .filter(lang => lang.localeCompare(this.defaultLanguage))
      .map(lang => ({lang, text: ''}))))
  }

  onSelectedLangChanges(lang: string) {
    const localizedText = this.value?.findTextForLanguage(this.selectedLanguage)
    if(localizedText) {
      localizedText.text = this.textInput?.nativeElement.value ?? ''
    }
    this.selectedLanguage = lang
    if(this.textInput) {
      this.textInput.nativeElement.value = this.value?.findTextForLanguage(lang)?.text
    }
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isEnabled = !isDisabled
  }

  writeValue(obj: MultilingualText): void {
    this.value = obj
  }

  getTextForLang(lang: string) {
    return this.value?.getTextForLanguageOrDefault(lang).text
  }
}
