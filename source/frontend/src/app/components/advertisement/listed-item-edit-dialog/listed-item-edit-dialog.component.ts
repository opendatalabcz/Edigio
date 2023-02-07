import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ListedItem, ResourceShort} from "../../../models/advertisement/resource";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {debounceTime, filter, first, mergeMap, Observable, of, takeUntil, tap} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LocalizedText} from "../../../models/common/multilingual-text";
import {TranslateService} from "@ngx-translate/core";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerRegex, integerValidator} from "../../../validators/number-validators";
import {isNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";

@UntilDestroy()
@Component({
  selector: 'app-listed-item-edit-dialog',
  templateUrl: './listed-item-edit-dialog.component.html',
  styleUrls: ['./listed-item-edit-dialog.component.scss']
})
export class ListedItemEditDialogComponent implements OnInit {
  form: FormGroup;

  listedItem?: ListedItem

  filteredResources?: Observable<ResourceShort[]>;
  searchingForResources: boolean = false;
  resourceControl: FormControl<Nullable<ResourceShort>> = new FormControl<Nullable<ResourceShort>>(null);
  resourceFilterControl: FormControl<Nullable<string>> = new FormControl<string>('');

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ListedItemEditDialogComponent>,
    private resourceService: ResourceService,
    private multilingualTextService: MultilingualTextService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data?: ListedItem,
  ) {
    this.form = this.createEditForm(fb)
  }

  private filterStringToLocalizedText(value: string) : LocalizedText{
    return {text: value, lang: this.translateService.currentLang}
  }

  ngOnInit(): void {
    this.filteredResources = this.resourceFilterControl.valueChanges
      .pipe(
        tap(() => console.log("Hello there -> General Kenobi!")),
        //Filter out blank string search requests
        filter(isDefinedNotBlank),
        //Start loading animation of filter
        tap(() => this.searchingForResources = true),
        //Reduce number of requests sent by minimal interval between search requests
        debounceTime(200),
        //Request all viable resources from server
        mergeMap(resourceNameText => this.resourceService.findAllByName(
          this.filterStringToLocalizedText(resourceNameText)
        ).pipe(first())),
        untilDestroyed(this)
      )
    if(this.data) {
      this.resourceFilterControl.setValue(
        this.data.resource.name.requireTextForLanguage(this.translateService.currentLang).text
      )
      this.resourceControl.setValue(this.data.resource)
      console.log('Set :))')
    }
  }

  private createEditForm(formBuilder: FormBuilder) :  FormGroup {
    return formBuilder.group({
      resource: [],
      description: [],
      amount: [this.data?.amount ?? 1, [Validators.min(1), integerValidator]],
    })
  }

  get resources$() : Observable<ResourceShort[]> {
    return this.resourceService.getAllResourcesByIds$(['megausefulthing'])
  }

  onResourceSelect(option: MatAutocompleteSelectedEvent) {
    console.log('Selected :)', option.option.value)
  }

  private listedItemFromForm(formGroup: FormGroup) : Nullable<ListedItem> {
    const amount = formGroup.get('amount')?.value ?? 0
    const resource = this.resourceControl.value
    if(isNullOrUndefined(resource)) {
      return null;
    }
    return {
      id: this.data?.id,
      resource,
      amount
    }
  }

  submit(formGroup: FormGroup) {
    const result = this.listedItemFromForm(formGroup)
    if(!result) {
      this.notificationService.failure('Malformed data in form!', false)
      return;
    }
    this.ref.close({result: DialogResults.SUCCESS, data: result})
  }

  close() {
    this.ref.close({result: DialogResults.FAILURE})
  }
}
