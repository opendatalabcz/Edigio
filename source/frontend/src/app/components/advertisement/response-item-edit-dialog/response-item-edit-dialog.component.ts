import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ResourceShort} from "../../../models/advertisement/resource";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {debounceTime, filter, first, map, mergeMap, Observable, tap} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LocalizedText} from "../../../models/common/multilingual-text";
import {TranslateService} from "@ngx-translate/core";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerValidator} from "../../../validators/number-validators";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ListedItem} from "../../key-value-table/key-value-table.component";
import {NGXLogger} from "ngx-logger";
import {isArrayEmpty} from "../../../utils/array-utils";
import {LanguageService} from "../../../services/language.service";

export interface ResponseItemEditDialogData {
  item?: ListedItem,
  advertisementType: AdvertisementType,
  otherListedResources: ListedItem[],
  allowDuplicatedResources?: boolean
}


@UntilDestroy()
@Component({
  selector: 'app-listed-item-edit-dialog',
  templateUrl: './response-item-edit-dialog.component.html',
  styleUrls: ['./response-item-edit-dialog.component.scss']
})
export class ResponseItemEditDialogComponent implements OnInit {
  form: FormGroup;

  filteredResources?: Observable<ResourceShort[]>;
  searchingForResources: boolean = false;
  resourceControl: FormControl<Nullable<ResourceShort>> = new FormControl<Nullable<ResourceShort>>(null);
  resourceFilterControl: FormControl<Nullable<string>> = new FormControl<string>('');
  resourceNotFound = false;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ResponseItemEditDialogComponent>,
    private resourceService: ResourceService,
    private multilingualTextService: MultilingualTextService,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    @Inject(MAT_DIALOG_DATA) public data: ResponseItemEditDialogData,
  ) {
    this.form = this.createEditForm(fb)
  }

  private filterStringToLocalizedText(value: string): LocalizedText {
    return {text: value, lang: this.languageService.instantLanguage.code}
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
    if (this.data.item) {
      this.resourceControl.setValue(this.data.item?.resource)
      console.log('Set :))')
    }
  }

  private createEditForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      resource: [this.data.item?.resource, []],
      description: [this.data.item?.description],
      amount: [this.data.item?.amount ?? 1, [Validators.min(1), integerValidator]],
    })
  }

  get resources$(): Observable<ResourceShort[]> {
    return this.resourceService.getAllResourcesByIds$(['megausefulthing'])
  }

  onResourceSelect(option: MatAutocompleteSelectedEvent) {
    console.log('Selected :)', option.option.value)
  }

  private listedItemFromForm(formGroup: FormGroup): Nullable<ListedItem> {
    const amount = formGroup.get('amount')?.value ?? 0
    const resource = this.resourceControl.value
    if (isObjectNullOrUndefined(resource)) {
      return null;
    }
    return {
      id: this.data?.item?.id,
      resource,
      description: formGroup.get('description')?.value,
      amount
    }
  }

  submit(formGroup: FormGroup) {
    const result = this.listedItemFromForm(formGroup)
    if (!result || formGroup.invalid) {
      this.notificationService.failure('Malformed data in form!', false)
      this.logger
        .debug('Form received malformed data!', result, "Form validity: " + formGroup.invalid ? 'invalid' : 'valid')
      return;
    }
    this.ref.close({result: DialogResults.SUCCESS, data: result})
  }

  /**
   * Retrieves key with path relative to selected advertisement type
   *
   * @param relativePath Path that's relative to dictionary for selected advertisement type
   */
  getTranslationKey(relativePath: string): string {
    if (!relativePath) {
      this.logger.warn('Received empty relative path of translation key')
    }
    return `LISTED_ITEM_EDIT_DIALOG.${this.data.advertisementType.toUpperCase()}ED_ITEM.${relativePath}`
  }

  close() {
    this.ref.close({result: DialogResults.FAILURE})
  }
}
