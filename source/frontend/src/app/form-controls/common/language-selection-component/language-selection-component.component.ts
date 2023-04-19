import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ReadOnlyLanguage} from "../../../models/common/language";
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {requireDefinedNotNull} from "../../../shared/assertions/object-assertions";
import {anyMatch} from "../../../shared/utils/array-utils";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {isObjectNotNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {filter} from "rxjs";

/**
 * Component used to select one of given languages
 */
@UntilDestroy()
@Component({
  selector: 'app-language-selection-component',
  templateUrl: './language-selection-component.component.html',
  styleUrls: ['./language-selection-component.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguageSelectionComponentComponent),
      multi: true
    }
  ]
})
export class LanguageSelectionComponentComponent implements ControlValueAccessor, OnInit {
  @Input() availableLanguages: readonly ReadOnlyLanguage[] = []
  @Input() label: string = '';
  @Input() hint: string = '';

  private _value?: ReadOnlyLanguage

  get value(): ReadOnlyLanguage {
    return requireDefinedNotNull(this._value, 'Language not set!')
  }

  set value(language: ReadOnlyLanguage) {
    if (!anyMatch(this.availableLanguages, (lang) => lang.code === language.code)) {
      throw new Error('Language thats not in the list of available languages set!')
    }
    this._value = language
    this.onChange?.(this.value)
  }

  private onChange?: (lang: ReadOnlyLanguage) => void

  private onTouch?: (lang: ReadOnlyLanguage) => void

  isDisabled: boolean = false

  languageSelectControl: FormControl<ReadOnlyLanguage | null | undefined>
    = new FormControl<ReadOnlyLanguage | undefined>(this._value);


  ngOnInit(): void {
    this.languageSelectControl.valueChanges
      .pipe(
        filter(isObjectNotNullOrUndefined),
        untilDestroyed(this),
      )
      .subscribe((value) => {
        this.value = value
      })
  }

  compareLangsByCode(firstLang: ReadOnlyLanguage, secondLang: ReadOnlyLanguage): boolean {
    return firstLang?.code === secondLang?.code
  }

  trackByLangCode(_index: number, lang: ReadOnlyLanguage): string {
    return lang.code
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  writeValue(obj: any): void {
    //As subscription of select control valueChanges should be already setup while writing the value,
    // it should be most likely enough to simply patch the value, and rest will be handled in the subscription
    // (confirmed that by some experiments using console.log(...))
    this.languageSelectControl.patchValue(obj)
  }

}
