import {Component, Inject, OnInit} from '@angular/core';
import {AdvertisementResponse} from "../../../../models/advertisement/advertisement-response";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ConfirmationDialogResult, DialogResults} from "../../../../models/common/dialogResults";
import {requireDefinedNotNull, requireNotNull} from "../../../../utils/assertions/object-assertions";
import {first, map} from "rxjs";

interface AdvertisemntResponseAcceptFormCotnrols {
  note: FormControl<string>
}

export interface AdvertisementResponseAcceptDialogResult {
  dialogResult: ConfirmationDialogResult
  note?: string
}

@Component({
  selector: 'app-advertisement-response-accept-dialog',
  templateUrl: './advertisement-response-accept-dialog.component.html',
  styleUrls: ['./advertisement-response-accept-dialog.component.scss']
})
export class AdvertisementResponseAcceptDialogComponent implements OnInit {

  private _form?: FormGroup<AdvertisemntResponseAcceptFormCotnrols>

  get form(): FormGroup<AdvertisemntResponseAcceptFormCotnrols> {
    return requireDefinedNotNull(this._form);
  }

  set form(value: FormGroup<AdvertisemntResponseAcceptFormCotnrols>) {
    this._form = value;
  }

  constructor(@Inject(MAT_DIALOG_DATA) private data: AdvertisementResponse,
              private matDialogRef: MatDialogRef<AdvertisementResponseAcceptDialogComponent, AdvertisementResponseAcceptDialogResult>,
              private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      note: ['']
    })
    this.matDialogRef.beforeClosed()
      //When dialog was closed without submit, setup result to failed
      .pipe(map(result => result?.dialogResult ? result.dialogResult : {result: ConfirmationDialogResult.CANCEL}))
  }


  submit(form: FormGroup<AdvertisemntResponseAcceptFormCotnrols>) {
    this.matDialogRef.close({
      dialogResult: ConfirmationDialogResult.CONFIRMED,
      note: form.value.note
    })
  }

  close() {
    this.matDialogRef.close({
      dialogResult: ConfirmationDialogResult.CANCEL
    })
  }
}
