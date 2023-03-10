import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../../../services/notification.service";
import {catchError, EMPTY, filter, first, mergeMap, Observable, of, tap} from "rxjs";
import {isDefinedNotBlank} from "../../../../utils/predicates/string-predicates";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {
  UserEmailEditConfirmationDialogComponent,
  UserEmailEditConfirmationDialogResult
} from "../user-email-edit-confirmation-dialog/user-email-edit-confirmation-dialog.component";
import {DialogResults} from "../../../../models/common/dialogResults";
import {UserService} from "../../../../services/user.service";
import {Nullable} from "../../../../utils/types/common";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {isObjectNotNullOrUndefined} from "../../../../utils/predicates/object-predicates";

interface EmailEditFormControls {
  email: FormControl<string>
  repeatEmail: FormControl<string>
}

interface CodesPair {
  originalEmailCode: string
  newEmailCode: string
}

@Component({
  selector: 'app-user-email-edit-form',
  templateUrl: './user-email-edit-form.component.html',
  styleUrls: ['./user-email-edit-form.component.scss']
})
export class UserEmailEditFormComponent implements OnInit {
  @Input() user: User = {}
  _emailEditForm?: FormGroup<EmailEditFormControls>
  private set emailEditForm(form: FormGroup<EmailEditFormControls>) {
    this._emailEditForm = form
  }

  get emailEditForm(): FormGroup<EmailEditFormControls> {
    return requireDefinedNotNull(this._emailEditForm)
  }

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.emailEditForm = this.fb.nonNullable.group({
      email: ['', [Validators.email]],
      repeatEmail: ['', [RxwebValidators.compare({fieldName: 'email'})]]
    })
  }

  private retrieveConfirmationCodes(): Observable<Nullable<CodesPair>> {
    return this.matDialog
      .open<UserEmailEditConfirmationDialogComponent, {}, UserEmailEditConfirmationDialogResult>(
        UserEmailEditConfirmationDialogComponent
      )
      .afterClosed()
      .pipe(
        tap((result) => {
          if (result?.dialogResult !== DialogResults.SUCCESS) {
            this.notificationService.failure('USER_EDIT.EMAIL.CONFIRMATION_DIALOG_CLOSED_WITHOUT_SUBMIT', true)
          } else if (result?.dialogResult === DialogResults.SUCCESS
            && (!isDefinedNotBlank(result.originalEmailCode) || !isDefinedNotBlank(result.newEmailCode))) {
            this.notificationService.failure('USER_EDIT.TELEPHONE_NUMBER.INVALID_STATE', true)
          }
        }),
        mergeMap((result) => {
          return result?.dialogResult === DialogResults.SUCCESS
          && isDefinedNotBlank(result?.originalEmailCode) && isDefinedNotBlank(result?.newEmailCode) ? of({
            originalEmailCode: result.originalEmailCode,
            newEmailCode: result.newEmailCode
          }) : EMPTY
        }),
      )
  }

  private handleChangeRequestFailure() {
    //Most likely problem on server side.
    this.notificationService.failure('USER_EDIT.EMAIL.CHANGE_REQUEST_FAILED', true)
  }

  private submitConfirmationCodes(codesPair: CodesPair) {
    return this.userService.confirmCurrentUserEmailChange$(codesPair)
  }

  private handleEmailChangeRequestCreationError(err: unknown): void {
    //Handle errors that may have occurred during change request (before confirmation send)
    if (err instanceof HttpErrorResponse) {
      if (err.status >= 500) {
        this.notificationService.failure(
          'USER_EDIT.EMAIL.CHANGE_REQUEST_FAILED.SERVER_SIDE_ERROR',
          true
        )
      } else if (err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure(
          'USER_EDIT.EMAIL.CHANGE_REQUEST_FAILED.FORBIDDEN',
          true
        )
      } else {
        this.notificationService.failure(
          'USER_EDIT.EMAIL.CHANGE_REQUEST_FAILED.UNKNOWN_HTTP_ERROR',
          true
        )
      }
    } else {
      this.notificationService.failure('USER_EDIT.EMAIL.CHANGE_REQUEST_FAILED.SERVER_SIDE_ERROR')
    }
  }

  private handleConfirmationError(err: unknown) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure('USER_EDIT.EMAIL.WRONG_CONFIRMATION_CODE')
      } else if (err.status > 500) {
        this.notificationService.failure('USER_EDIT.EMAIL.CONFIRMATION_SERVER_SIDE_ERROR')
      }
    } else {
      this.notificationService.failure('USER_EDIT.EMAIL.UNKNOWN_ERROR_DURING_CONFIRMATION')
    }
  }

  onSubmit(form: FormGroup<EmailEditFormControls>) {
    if (form.invalid) {
      this.notificationService.failure('USER_EDIT.EMAIL.SUBMIT_FAILED', true)
    } else if (form.value.email === this.user.email) {
      this.notificationService.failure('USER_EDIT.EMAIL.ENTERED_EMAIL_EQUAL_TO_ORIGINAL_EMAIL', true)
    } else if (!isDefinedNotBlank(form.value.email)) {
      this.notificationService.info('USER_EDIT.EMAIL.EMAIL_NOT_ENTERED', true)
    } else {
      this.userService.requestCurrentUserEmailChange$(form.value.email)
        .pipe(
          catchError((err) => {
            this.handleEmailChangeRequestCreationError(err)
            return EMPTY
          }),
          mergeMap(() => this.retrieveConfirmationCodes()),
          mergeMap((codes) => {
            if (!codes) {
              //Shouldn't really happen, but had it happen, i want to know about it
              this.notificationService.failure('USER_EDIT.EMAIL.INVALID_STATE', true)
              return EMPTY
            }
            return this.submitConfirmationCodes(codes)
          }),
          first(),
        )
        .subscribe({
          next: (result) => {
            if (result.status === HttpStatusCode.Ok) {
              this.notificationService.success('USER_EDIT.EMAIL.SUCCESS', true)
            }
          },
          error: (err: unknown) => this.handleConfirmationError(err)
        })
    }
  }


}
