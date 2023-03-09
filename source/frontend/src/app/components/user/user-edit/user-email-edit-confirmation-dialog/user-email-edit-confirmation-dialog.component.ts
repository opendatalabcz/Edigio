import {Component, OnInit} from '@angular/core';
import {DialogResults} from "../../../../models/common/dialogResults";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {first, map} from "rxjs";

export interface UserEmailEditConfirmationDialogResult {
  dialogResult: DialogResults
  originalEmailCode?: string
  newEmailCode?: string
}

interface UserEmailEditConfirmationFormControls {
    originalEmailCode: FormControl<string>,
    newEmailCode: FormControl<string>
}

type EmailEditConfirmationFormGroupType = FormGroup<UserEmailEditConfirmationFormControls>

@Component({
  selector: 'app-user-email-edit-confirmation-dialog',
  templateUrl: './user-email-edit-confirmation-dialog.component.html',
  styleUrls: ['./user-email-edit-confirmation-dialog.component.scss']
})
export class UserEmailEditConfirmationDialogComponent implements OnInit {


  private _form?: EmailEditConfirmationFormGroupType
  get form() : EmailEditConfirmationFormGroupType {
    return requireDefinedNotNull(this._form)
  }
  set form(form: EmailEditConfirmationFormGroupType) {
    this._form = form
  }

  constructor(
    private fb: FormBuilder,
    private matDialogRef: MatDialogRef<UserEmailEditConfirmationDialogComponent, UserEmailEditConfirmationDialogResult>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      originalEmailCode: ['', [Validators.required, RxwebValidators.notEmpty()]],
      newEmailCode: ['', [Validators.required, RxwebValidators.notEmpty()]]
    })
    this.matDialogRef
      .beforeClosed()
      .pipe(
        map(result => result ?? {dialogResult: DialogResults.FAILURE}),
        first()
      )
  }

  submit(form: EmailEditConfirmationFormGroupType) {
    this.matDialogRef.close({
      dialogResult: DialogResults.SUCCESS,
      originalEmailCode: form.value.originalEmailCode,
      newEmailCode: form.value.newEmailCode
    })
  }
}
