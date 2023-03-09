import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../../../services/notification.service";
import {catchError, EMPTY, first, map, mergeMap, Observable} from "rxjs";
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
        map((result?: UserEmailEditConfirmationDialogResult) => {
          if (result?.dialogResult === DialogResults.SUCCESS
            && (!isDefinedNotBlank(result.originalEmailCode) || !isDefinedNotBlank(result.newEmailCode))) {
            //This branch should never happend (it shouldn't be allowed by the dialog)
            throw new Error('Unknown error in form submissions')
          }
          //The not blank email code check is most likely redundant
          //It was already checked in previous if statement, although it seems typeguard is not working here,
          //therefore I added another check there, to keep transpiler silent
          return result?.dialogResult === DialogResults.SUCCESS
          && isDefinedNotBlank(result.originalEmailCode) && isDefinedNotBlank(result.newEmailCode) ? {
            originalEmailCode: result.originalEmailCode,
            newEmailCode: result.newEmailCode
          } : null
        })
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
          catchError(() => {
            this.notificationService.failure('USER_EDIT.EMAIL.CONFIRMATION_FAILED', true)
            return EMPTY
          }),
          mergeMap((codes) => {
            if (!codes) {
              this.notificationService.failure('USER_EDIT.EMAIL.CONFIRMATION_FAILED', true)
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
        })
    }
  }


}
