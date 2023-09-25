import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Nullable} from "../../../shared/types/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MultilingualText} from "../../../models/common/multilingual-text";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerValidator} from "../../../validators/number-validators";
import {isObjectNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {NGXLogger} from "ngx-logger";
import {LanguageService} from "../../../services/language.service";
import {ReadOnlyLanguage} from "../../../models/common/language";
import {AdvertisementItem} from "../../../models/advertisement/advertisement-item";
import {
  ADVERTISEMENT_ITEM_DESCRIPTION_MAX_LENGTH
} from "../../../validation/constants/advertisement-validation.constants";

export interface AdvertisedItemEditDialogData {
  item?: AdvertisementItem,
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

  protected readonly ADVERTISEMENT_ITEM_DESCRIPTION_MAX_LENGTH = ADVERTISEMENT_ITEM_DESCRIPTION_MAX_LENGTH;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<AdvertisedItemEditDialogComponent>,
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
    return formBuilder.group({
      resource: [this.data.item?.resource, []],
      description: [this.data.item?.description ?? MultilingualText.of({
        languageCode: this.data.defaultLanguage.code,
        text: ''
      })],
      amount: [this.data.item?.amount ?? 1, [Validators.min(1), integerValidator]],
    })
  }

  private listedItemFromForm(formGroup: FormGroup): Nullable<AdvertisementItem> {
    const amount = formGroup.get('amount')?.value ?? 0
    const resource = formGroup.get('resource')?.value
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

  close() {
    this.ref.close({result: DialogResults.FAILURE})
  }
}
