import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResourceService} from "../../../services/resource.service";
import {map} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {Nullable} from "../../../shared/types/common";
import {UntilDestroy} from "@ngneat/until-destroy";
import {DialogResults} from "../../../models/common/dialogResults";
import {integerValidator} from "../../../validators/number-validators";
import {isObjectNullOrUndefined} from "../../../shared/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
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
    @Inject(MAT_DIALOG_DATA) public data: ResponseItemEditDialogData,
  ) {
    this.form = this.createEditForm(fb)
  }

  ngOnInit(): void {
    this.ref
      .beforeClosed()
      .pipe(map((result) => {
        return isObjectNullOrUndefined(result?.data) || isObjectNullOrUndefined(result?.result) ? <ResponseItemEditDialogResult>{
          result: DialogResults.FAILURE
        } : result
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
    return `LISTED_ITEM_EDIT_DIALOG.${this.data.advertisementType.toUpperCase()}ED_ITEM.${relativePath}`
  }

  close() {
    this.ref.close({result: DialogResults.FAILURE, data: null})
  }
}
