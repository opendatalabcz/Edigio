import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {phoneNumberValidator} from "../../../../validators/contact-validators";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
import {catchError, EMPTY, first, mergeMap, Observable, of, tap} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {
  UserEditSingleCodeConfirmationDialogComponent,
  UserEditSingleCodeConfirmationDialogData,
  UserEditSingleCodeConfirmationDialogResult
} from "../user-edit-single-code-confirmation-dialog/user-edit-single-code-confirmation-dialog.component";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {DialogResults} from "../../../../models/common/dialogResults";
import {isDefinedNotBlank} from "../../../../utils/predicates/string-predicates";

interface TelephoneNumberEditFormControls {
  telephoneNumber: FormControl<string>
  repeatTelephoneNumber: FormControl<string>
}

@Component({
  selector: 'app-user-telephone-number-edit-form',
  templateUrl: './user-telephone-number-edit-form.component.html',
  styleUrls: ['./user-telephone-number-edit-form.component.scss']
})
export class UserTelephoneNumberEditFormComponent implements OnInit {
  _telephoneNumber?: string = undefined
  @Input()
  public set telephoneNumber(value: string | undefined) {
    this._telephoneNumber = value
  }

  public get telephoneNumber(): string | undefined {
    return this._telephoneNumber
  }

  _telephoneNumberEditForm?: FormGroup<TelephoneNumberEditFormControls>
  private set telephoneNumberEditForm(form: FormGroup<TelephoneNumberEditFormControls>) {
    this._telephoneNumberEditForm = form
  }

  get telephoneNumberEditForm(): FormGroup<TelephoneNumberEditFormControls> {
    return requireDefinedNotNull(this._telephoneNumberEditForm)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private userService: UserService,
              private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.telephoneNumberEditForm = this.fb.nonNullable.group({
      telephoneNumber: ['', [phoneNumberValidator]],
      repeatTelephoneNumber: ['', [RxwebValidators.compare({fieldName: 'telephoneNumber'})]]
    })
  }

  private handleRequestCreationHttpErrorResponse(err: HttpErrorResponse) {
    if (err.status > 500) {
      this.notificationService.failure('USER_EDIT.REQUEST_CREATION_SERVER_SIDE_ERROR', true)
    }
  }

  private handleRequestCreationError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      this.handleRequestCreationHttpErrorResponse(err)
    }
    return EMPTY
  }

  private createConfirmationDialogConfig(): { data: UserEditSingleCodeConfirmationDialogData } {
    return {
      data: {
        title: 'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.TITLE',
        message: 'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.MESSAGE',
        codeFieldLabel: 'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.CODE_FIELD.LABEL',
        codeFieldPlaceholder: 'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.CODE_FIELD.PLACEHOLDER',
        codeFieldHint: 'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.CODE_FIELD.HINT'
      }
    }
  }

  private retrieveConfirmationCode(): Observable<string | never> {
    return this.matDialog
      .open<
        UserEditSingleCodeConfirmationDialogComponent,
        UserEditSingleCodeConfirmationDialogData,
        UserEditSingleCodeConfirmationDialogResult
      >(UserEditSingleCodeConfirmationDialogComponent, this.createConfirmationDialogConfig())
      .afterClosed()
      .pipe(
        tap((result?: UserEditSingleCodeConfirmationDialogResult) => {
          if (result?.dialogResult !== DialogResults.SUCCESS) {
            this.notificationService.failure(
              'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG_CLOSED_WITHOUT_SUBMIT',
              true
            )
          } else if (result?.dialogResult === DialogResults.SUCCESS && !isDefinedNotBlank(result.code)) {
            this.notificationService.failure(
              'USER_EDIT.SINGLE_CODE_CONFIRMATION_RESULT_STATE_INVALID',
              true
            )
          }
        }),
        mergeMap((result?: UserEditSingleCodeConfirmationDialogResult) => {
          return isDefinedNotBlank(result?.code) && result?.dialogResult === DialogResults.SUCCESS ? of(result.code) : EMPTY
        })
      )
  }

  private handleConfirmationSuccess() {
    this.notificationService.success('USER_EDIT.TELEPHONE_NUMBER.SUCCESS', true)
  }

  private handleConfirmationError(err: unknown) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure('USER_EDIT.SINGLE_CODE_CONFIRMATION.WRONG_CONFIRMATION_CODE', true)
      } else if (err.status > 500) {
        this.notificationService.failure('USER_EDIT.SINGLE_CODE_CONFIRMATION.CONFIRMATION_SERVER_SIDE_ERROR', true)
      }
    }
  }

  onPhoneNumberSubmit(form: FormGroup<TelephoneNumberEditFormControls>) {
    if (form.invalid) {
      //Shouldn't happen, but in case it did, let's add one additional failsafe here
      this.notificationService.failure("FORMS.ERRORS.SUBMIT_FAILED", true)
    } else if (form.value.telephoneNumber === this.telephoneNumber) {
      this.notificationService.failure("USER_EDIT.TELEPHONE_NUMBER.NEW_NUMBER_SAME_AS_OLD_NUMBER")
    } else if (!isDefinedNotBlank(form.value.telephoneNumber)) {
      this.notificationService.info("USER_EDIT.TELEPHONE_NUMBER.TELEPHONE_NUMBER_NOT_ENTERED", true)
    } else {
      this.userService.requestCurrentUserPhoneNumberChange$(form.value.telephoneNumber)
        .pipe(
          catchError(err => this.handleRequestCreationError(err)),
          mergeMap(() => this.retrieveConfirmationCode()),
          //As error has been already handled in retrieveConfirmationCode, I can continue to sending confirmation code to the server
          //When EMPTY is returned from previous function, rest of pipeline is skipped
          mergeMap((code) => this.userService.confirmCurrentUserTelephoneNumberChange$(code)),
          first()
        )
        .subscribe({
          next: () => this.handleConfirmationSuccess(),
          error: (err) => this.handleConfirmationError(err)
        })
    }
  }

  get showNumberInvalidError(): boolean {
    return this.telephoneNumberEditForm.controls.telephoneNumber.hasError('required')
      || this.telephoneNumberEditForm.controls.telephoneNumber.hasError('phoneNumberInvalid')
  }
}
