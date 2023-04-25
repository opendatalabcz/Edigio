import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidatorFn} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../shared/assertions/object-assertions";
import {RxwebValidators} from "@rxweb/reactive-form-validators";
import {personNamePartValidator} from "../../../../validators/contact-validators";
import {User} from "../../../../models/common/user";
import {
  UserEditSingleCodeConfirmationDialogComponent,
  UserEditSingleCodeConfirmationDialogData,
  UserEditSingleCodeConfirmationDialogResult
} from "../user-edit-single-code-confirmation-dialog/user-edit-single-code-confirmation-dialog.component";
import {catchError, EMPTY, first, mergeMap, Observable, of, tap} from "rxjs";
import {DialogResults} from "../../../../models/common/dialogResults";
import {isDefinedNotBlank} from "../../../../shared/predicates/string-predicates";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";

interface FirstnameAndLastnameFormControls {
  firstname: FormControl<string>;
  lastname: FormControl<string>
}

type FirstnameAndLastnameFormGroup = FormGroup<FirstnameAndLastnameFormControls>

@Component({
  selector: 'app-user-firstname-lastname-edit-form',
  templateUrl: './user-firstname-lastname-edit-form.component.html',
  styleUrls: ['./user-firstname-lastname-edit-form.component.scss']
})
export class UserFirstnameLastnameEditFormComponent implements OnInit {
  @Input() user?: User

  _firstnameAndLastnameForm?: FirstnameAndLastnameFormGroup
  private set firstnameAndLastnameForm(form: FirstnameAndLastnameFormGroup) {
    this._firstnameAndLastnameForm = form
  }

  get firstnameAndLastnameForm(): FirstnameAndLastnameFormGroup {
    return requireDefinedNotNull(this._firstnameAndLastnameForm)
  }

  constructor(private fb: FormBuilder,
              private matDialog: MatDialog,
              private notificationService: NotificationService,
              private userService: UserService
  ) {
  }


  private conditionalNamePartValidatorFn(validatedPart: 'firstname' | 'lastname'): ValidatorFn {
    return RxwebValidators.compose({
      validators: [personNamePartValidator],
      conditionalExpression: (formControlsValues: { firstname: string, lastname: string }) => {
        return !!formControlsValues[validatedPart]
      }
    })
  }

  ngOnInit(): void {
    this.firstnameAndLastnameForm = this.fb.nonNullable.group({
      firstname: ['', [this.conditionalNamePartValidatorFn('firstname')]],
      lastname: ['', [this.conditionalNamePartValidatorFn('lastname')]],
    })
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
              'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG.RESULT_STATE_INVALID',
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
    this.notificationService.success('USER_EDIT.FIRSTNAME_LASTNAME.SUCCESS', true)
  }

  private handleConfirmationError(err: unknown) {
    if (err instanceof HttpErrorResponse) {
      if (err.status === HttpStatusCode.Forbidden) {
        this.notificationService.failure(
          'USER_EDIT.SINGLE_CODE_CONFIRMATION.WRONG_CONFIRMATION_CODE',
          true
        )
      } else if (err.status > 500) {
        this.notificationService.failure(
          'USER_EDIT.SINGLE_CODE_CONFIRMATION.CONFIRMATION_SERVER_SIDE_ERROR',
          true
        )
      }
    }
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

  private handleValidFormSubmit(firstname?: string, lastname?: string) {
    this.userService.requestCurrentUserFirstnameOrLastnameChange$({firstname, lastname})
      .pipe(
        catchError(err => this.handleRequestCreationError(err)),
        mergeMap(() => this.retrieveConfirmationCode()),
        //As error has been already handled in retrieveConfirmationCode, I can continue to sending confirmation code to the server
        //When EMPTY is returned from previous function, rest of pipeline is skipped
        mergeMap((code) => this.userService.confirmCurrentUserFirstnameOrLastnameChange$(code)),
        first()
      )
      .subscribe({
        next: () => this.handleConfirmationSuccess(),
        error: (err) => this.handleConfirmationError(err)
      })
  }

  onSubmit(form: FirstnameAndLastnameFormGroup) {
    if (form.invalid) {
      //Can't really imagine how this might've happened
      this.notificationService.failure('USER_EDIT.FIRSTNAME_LASTNAME.SUBMITTED_FORM_INVALID', true)
    } else if (form.pristine) {
      //Nothing has changed, return
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else if (form.value.firstname === this.user?.firstname && form.value.lastname === this.user?.lastname) {
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else {
      this.handleValidFormSubmit(form.value.firstname, form.value.lastname)
    }
  }

}
