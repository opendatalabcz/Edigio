import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  AdvertisedItemEditDialogComponent,
  AdvertisedItemEditDialogData
} from "../advertised-item-edit-dialog/advertised-item-edit-dialog.component";
import {AdvertisementTemplate, AdvertisementTemplateShort} from "../../../models/advertisement/advertisement-template";
import {ConfirmationDialogResult} from "../../../models/common/dialogResults";

export interface AdvertisementTemplateConfirmApplyDialogData {
  advertisementTemplate: AdvertisementTemplate
}

@Component({
  selector: 'app-advertisement-template-confirm-apply-dialog',
  templateUrl: './advertisement-template-confirm-apply-dialog.component.html',
  styleUrls: ['./advertisement-template-confirm-apply-dialog.component.scss']
})
export class AdvertisementTemplateConfirmApplyDialogComponent {

  template?: AdvertisementTemplate

  constructor(private ref: MatDialogRef<AdvertisedItemEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AdvertisementTemplateConfirmApplyDialogData) {
    this.template = data.advertisementTemplate
  }

  confirm() {
    this.ref.close(ConfirmationDialogResult.CONFIRMED)
  }

  cancel() {
    this.ref.close(ConfirmationDialogResult.CANCEL)
  }
}
