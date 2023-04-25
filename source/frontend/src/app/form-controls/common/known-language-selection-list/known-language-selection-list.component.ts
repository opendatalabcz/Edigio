import {AfterContentInit, Component, forwardRef} from '@angular/core';
import {ReadOnlyLanguage} from "../../../models/common/language";
import {BehaviorSubject} from "rxjs";
import {LanguageService} from "../../../services/language.service";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {anyMatch} from "../../../shared/utils/array-utils";

@Component({
  selector: 'app-known-language-selection-list',
  templateUrl: './known-language-selection-list.component.html',
  styleUrls: ['./known-language-selection-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KnownLanguageSelectionListComponent),
      multi: true
    }
  ]
})
export class KnownLanguageSelectionListComponent implements ControlValueAccessor, AfterContentInit {

  selectedLanguages$: BehaviorSubject<ReadOnlyLanguage[]> = new BehaviorSubject<ReadOnlyLanguage[]>([])
  private notSelectedKnownLanguages: ReadOnlyLanguage[] = []
  filteredNotSelectedKnownLanguages$: BehaviorSubject<ReadOnlyLanguage[]> = new BehaviorSubject<ReadOnlyLanguage[]>([])
  private filterValue = ''

  private onChange?: (selectedLanguages: ReadOnlyLanguage[]) => void
  private onTouch?: () => void

  langToString(lang: ReadOnlyLanguage): string {
    return lang.name
  }

  constructor(private languageService: LanguageService) {
  }

  private languagesSortFn(first: ReadOnlyLanguage, second: ReadOnlyLanguage) {
    return first.name.localeCompare(second.name)
  }

  ngAfterContentInit(): void {
    this.selectedLanguages$
      .subscribe((langs) => {
        this.notSelectedKnownLanguages = [...this.languageService.knownLanguages]
          .sort(this.languagesSortFn)
          .filter(
            lang => !anyMatch(langs, selectedLang => selectedLang.code === lang.code)
          )
        this.refreshFilteredNotUsedLanguages()
      })
  }


  selectLanguage(langToAdd: ReadOnlyLanguage) {
    this.selectedLanguages$.next([...this.selectedLanguages$.value, langToAdd].sort(this.languagesSortFn))
    this.onTouch?.()
    this.onChange?.(this.selectedLanguages$.value)
    this.refreshFilteredNotUsedLanguages()
  }

  private refreshFilteredNotUsedLanguages() {
    this.filteredNotSelectedKnownLanguages$.next(
      this.notSelectedKnownLanguages.filter(lang => lang.name.toLowerCase().includes(this.filterValue.toLowerCase()))
    )
  }

  onFilterChange(namePart: string) {
    this.filterValue = namePart
    this.refreshFilteredNotUsedLanguages()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
  }

  writeValue(obj: readonly ReadOnlyLanguage[]): void {
    this.selectedLanguages$.next([...obj].sort(this.languagesSortFn))
  }


  delete(lang: ReadOnlyLanguage) {
    this.selectedLanguages$.next(
      this.selectedLanguages$.value.filter(selectedLang => selectedLang.code !== lang.code)
    )
    this.notSelectedKnownLanguages.push(lang)
    this.notSelectedKnownLanguages.sort(this.languagesSortFn)
    this.refreshFilteredNotUsedLanguages()
    this.onTouch?.()
    this.onChange?.(this.selectedLanguages$.value)
  }
}
