import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ResourceShort} from "../../../models/advertisement/resource";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {debounceTime, filter, map, mergeMap, Observable, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../utils/types/common";
import {isDefinedNotBlank} from "../../../utils/predicates/string-predicates";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LocalizedText} from "../../../models/common/multilingual-text";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerValidator} from "../../../validators/number-validators";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {ListedItem} from "../../key-value-table/key-value-table.component";
import {NGXLogger} from "ngx-logger";
import {isArrayEmpty} from "../../../utils/array-utils";
import {LanguageService} from "../../../services/language.service";
import {ResponseItem} from "../../../models/advertisement/response-item";

export interface ResponseItemEditDialogData {
  item?: ResponseItem,
  advertisementType: AdvertisementType,
}

export interface ResponseItemEditDialogResult {
  data: Nullable<ResponseItem>
  result: DialogResults
}


@UntilDestroy()
@Component({
  selector: 'app-listed-item-edit-dialog',
  templateUrl: './response-item-edit-dialog.component.html',
  styleUrls: ['./response-item-edit-dialog.component.scss']
})
export class ResponseItemEditDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ResponseItemEditDialogComponent, ResponseItemEditDialogResult>,
    private resourceService: ResourceService,
    private multilingualTextService: MultilingualTextService,
    private languageService: LanguageService,
    private notificationService: NotificationService,
    private logger: NGXLogger,
    @Inject(MAT_DIALOG_DATA) public data: ResponseItemEditDialogData,
  ) {
    this.form = this.createEditForm(fb)
  }

  ngOnInit(): void {
    this.ref
      .beforeClosed()
      .pipe(map((result) => {
        result
      }))
  }



  private createEditForm(formBuilder: FormBuilder): FormGroup {
    return formBuilder.group({
      resource: [this.data.item?.resource, []],
      description: [this.data.item?.description],
      amount: [this.data.item?.amount ?? 1, [Validators.min(1), integerValidator]],
    })
  }

  private listedItemFromForm(formGroup: FormGroup): Nullable<ResponseItem> {
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
    this.ref.close({result: DialogResults.FAILURE, data: null})
  }
}
