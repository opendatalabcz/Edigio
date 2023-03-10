import {Component, Inject, OnInit} from '@angular/core';
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {first, map} from "rxjs";
import {DialogResults} from "../../../../models/common/dialogResults";

export interface UserEditSingleCodeConfirmationDialogResult {
  dialogResult: DialogResults
  code?: string
}

export interface UserEditSingleCodeConfirmationDialogData {
  title: string
  message: string
  codeFieldLabel: string
  codeFieldPlaceholder: string
  codeFieldHint: string
}

interface UserEditSingleCodeConfirmationFormControls {
  code: FormControl<string>
}

type UserEditSingleCodeConfirmationFormGroupType = FormGroup<UserEditSingleCodeConfirmationFormControls>

@Component({
  selector: 'app-user-edit-single-code-confirmation-dialog',
  templateUrl: './user-edit-single-code-confirmation-dialog.component.html',
  styleUrls: ['./user-edit-single-code-confirmation-dialog.component.scss']
})
export class UserEditSingleCodeConfirmationDialogComponent implements OnInit{
  private _form?: UserEditSingleCodeConfirmationFormGroupType
  get form() : UserEditSingleCodeConfirmationFormGroupType {
    return requireDefinedNotNull(this._form)
  }
  set form(form: UserEditSingleCodeConfirmationFormGroupType) {
    this._form = form
  }

  constructor(
    private fb: FormBuilder,
    public matDialogRef: MatDialogRef<UserEditSingleCodeConfirmationDialogComponent, UserEditSingleCodeConfirmationDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: UserEditSingleCodeConfirmationDialogData
  ) {

  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      code: ['', [Validators.required, RxwebValidators.notEmpty()]],
    })
    this.matDialogRef
      .beforeClosed()
      .pipe(
        map(result => result ?? {dialogResult: DialogResults.FAILURE}),
        first()
      )
  }

  get titleTranslateKey(): string {
    return this.data.title
  }

  get messageTranslateKey(): string {
    return this.data.message
  }

  get codeFieldLabelTranslateKey(): string {
    return this.data.codeFieldLabel
  }

  get codeFieldPlaceholderTranslateKey(): string {
    return this.data.codeFieldPlaceholder
  }

  get codeFieldHintTranslateKey(): string {
    return this.data.codeFieldHint
  }

  submit(form: UserEditSingleCodeConfirmationFormGroupType) {
    this.matDialogRef.close({
      dialogResult: DialogResults.SUCCESS,
      code: form.value.code
    })
  }
}
