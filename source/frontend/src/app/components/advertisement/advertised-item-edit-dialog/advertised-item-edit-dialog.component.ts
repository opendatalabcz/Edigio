import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ResourceShort} from "../../../models/advertisement/resource";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {debounceTime, filter, mergeMap, Observable, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LocalizedText, MultilingualText} from "../../../models/common/multilingual-text";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerValidator} from "../../../validators/number-validators";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ListedItem} from "../../key-value-table/key-value-table.component";
import {NGXLogger} from "ngx-logger";
import {isArrayEmpty} from "../../../utils/array-utils";
import {LanguageService} from "../../../services/language.service";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {AdvertisedItem} from "../../../models/advertisement/advertised-item";

export interface AdvertisedItemEditDialogData {
  item?: AdvertisedItem,
  advertisementType: AdvertisementType,
  defaultLanguage: ReadOnlyLanguage
}


@UntilDestroy()
@Component({
  selector: 'app-advertised-item-edit-dialog',
  templateUrl: './advertised-item-edit-dialog.component.html',
  styleUrls: ['./advertised-item-edit-dialog.component.scss']
})
export class AdvertisedItemEditDialogComponent implements OnInit {
  form: FormGroup;
  availableLanguages: readonly ReadOnlyLanguage[] = [];
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AdvertisedItemEditDialogComponent>,
    private resourceService: ResourceService,
    private multilingualTextService: MultilingualTextService,
    protected languageService: LanguageService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    @Inject(MAT_DIALOG_DATA) public data: AdvertisedItemEditDialogData,
  ) {
    this.form = this.createEditForm(fb)
  }

  ngOnInit(): void {
    this.availableLanguages = this.languageService.getAvailableLanguages()
  }



  private createEditForm(formBuilder: FormBuilder): FormGroup {
    console.dir('Given item: ', this.data.item)
    return formBuilder.group({
      resource: [this.data.item?.resource, []],
      description: [this.data.item?.description ?? MultilingualText.of({
        lang: this.data.defaultLanguage.code,
        text: ''
      })],
      amount: [this.data.item?.amount ?? 1, [Validators.min(1), integerValidator]],
    })
  }

  private listedItemFromForm(formGroup: FormGroup): Nullable<AdvertisedItem> {
    const amount = formGroup.get('amount')?.value ?? 0
    const resource = formGroup.get('resource')?.value
    if (isObjectNullOrUndefined(resource)) {
      return null;
    }
    console.log(formGroup.get('description')?.value)
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

  close() {
    this.ref.close({result: DialogResults.FAILURE})
  }
}
