import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ConfirmationDialogResult} from "../../../models/common/dialogResults";
import {requireDefinedNotNull} from "../../../shared/assertions/object-assertions";
import {map} from "rxjs";
import {
  ADVERTISER_NOTE_MAX_LENGTH,
  RESPONDER_NOTE_MAX_LENGTH
} from "../../../validation/constants/advertisement-validation.constants";

interface AdvertisementResponseRejectFormControls {
  note: FormControl<string>
}

export interface AdvertisementResponseRejectDialogResult {
  dialogResult: ConfirmationDialogResult
  note?: string
}

@Component({
  selector: 'app-advertisement-response-reject-dialog',
  templateUrl: './advertisement-response-reject-dialog.component.html',
  styleUrls: ['./advertisement-response-reject-dialog.component.scss']
})
export class AdvertisementResponseRejectDialogComponent implements OnInit {

  protected readonly ADVERTISER_NOTE_MAX_LENGTH = ADVERTISER_NOTE_MAX_LENGTH;

  private _form?: FormGroup<AdvertisementResponseRejectFormControls>

  get form(): FormGroup<AdvertisementResponseRejectFormControls> {
    return requireDefinedNotNull(this._form);
  }

  set form(value: FormGroup<AdvertisementResponseRejectFormControls>) {
    this._form = value;
  }

  constructor(private matDialogRef: MatDialogRef<AdvertisementResponseRejectDialogComponent, AdvertisementResponseRejectDialogResult>,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      note: ['']
    })
    this.matDialogRef.beforeClosed()
      //When dialog was closed without submit, setup result to failed
      .pipe(map(result => result?.dialogResult ? result.dialogResult : {result: ConfirmationDialogResult.CANCEL}))
  }


  submit(form: FormGroup<AdvertisementResponseRejectFormControls>) {
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
