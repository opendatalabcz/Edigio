import {Component, forwardRef} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Nullable} from "../../../utils/types/common";
import {ResourceShort} from "../../../models/advertisement/resource";
import {debounceTime, filter, mergeMap, Observable, tap} from "rxjs";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {isArrayEmpty} from "../../../utils/array-utils";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {ResourceService} from "../../../services/resource.service";
import {LocalizedText} from "../../../models/common/multilingual-text";
import {LanguageService} from "../../../services/language.service";

@UntilDestroy(this)
@Component({
  selector: 'app-listed-item-resource-search-field',
  templateUrl: './listed-item-resource-search-field.component.html',
  styleUrls: ['./listed-item-resource-search-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ListedItemResourceSearchFieldComponent),
      multi: true
    }
  ]
})
export class ListedItemResourceSearchFieldComponent implements ControlValueAccessor {
  filteredResources?: Observable<ResourceShort[]>;
  searchingForResources: boolean = false;
  resourceControl: FormControl<Nullable<ResourceShort>> = new FormControl<Nullable<ResourceShort>>(null);
  resourceFilterControl: FormControl<Nullable<string>> = new FormControl<string>('');
  resourceNotFound = false;
  private onChange?: (resource: Nullable<ResourceShort>) => void
  private onTouched?: () => void;

  isDisabled: boolean = false

  public constructor(private resourceService: ResourceService,
                      private languageService: LanguageService) {
  }

  private filterStringToLocalizedText(value: string): LocalizedText {
    return {text: value, languageCode: this.languageService.instantLanguage.code}
  }

  ngOnInit(): void {
    this.filteredResources = this.resourceFilterControl.valueChanges
      .pipe(
        //Filter out blank string search requests
        filter(isDefinedNotBlank),
        tap(() => this.resourceNotFound = false),
        //Start loading animation of filter
        tap(() => this.searchingForResources = true),
        //Reduce number of requests sent by minimal interval between search requests
        debounceTime(200),
        //Request resources for all listed items
        mergeMap(resourceNameText => this.resourceService.findPageByName(
          //Filter is in simple text, but localized text is expected for actual filtering
          //Therefore we construct localized text for current language
          this.filterStringToLocalizedText(resourceNameText)
        )),
        tap(() => this.searchingForResources = false),
        tap((resources) => this.resourceNotFound = isArrayEmpty(resources)),
        untilDestroyed(this)
      )
    this.resourceControl.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((resource) => this.onChange?.(resource))
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

  writeValue(obj: ResourceShort): void {
    this.resourceControl.setValue(obj)
  }
}
