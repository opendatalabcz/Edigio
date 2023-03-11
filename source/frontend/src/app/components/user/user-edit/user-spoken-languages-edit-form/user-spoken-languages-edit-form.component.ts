import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {NotificationService} from "../../../../services/notification.service";
import {User} from "../../../../models/common/user";
import {
  UserEditSingleCodeConfirmationDialogComponent,
  UserEditSingleCodeConfirmationDialogData, UserEditSingleCodeConfirmationDialogResult
} from "../user-edit-single-code-confirmation-dialog/user-edit-single-code-confirmation-dialog.component";
import {catchError, EMPTY, first, mergeMap, Observable, of, tap} from "rxjs";
import {DialogResults} from "../../../../models/common/dialogResults";
import {isDefinedNotBlank} from "../../../../utils/predicates/string-predicates";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
import {PublishedContactDetailSettings} from "../../../../models/common/contact";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../services/user.service";
import {containsAll} from "../../../../utils/array-utils";

interface UserSpokenLanguagesEditFormControls {
  spokenLanguages: FormControl<ReadOnlyLanguage[]>
}

type UserSpokenLanguagesEditFormGroup = FormGroup<UserSpokenLanguagesEditFormControls>

@Component({
  selector: 'app-user-spoken-languages-edit-form',
  templateUrl: './user-spoken-languages-edit-form.component.html',
  styleUrls: ['./user-spoken-languages-edit-form.component.scss']
})
export class UserSpokenLanguagesEditFormComponent implements OnInit {
  @Input() user: User = {}


  _form?: UserSpokenLanguagesEditFormGroup
  set form(value: UserSpokenLanguagesEditFormGroup) {
    this._form = value
  }
  get form() : UserSpokenLanguagesEditFormGroup {
    return requireDefinedNotNull(this._form)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private matDialog: MatDialog,
              private userService: UserService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      spokenLanguages: [[...(this.user.spokenLanguages ?? [])]]
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
          if(result?.dialogResult !== DialogResults.SUCCESS) {
            this.notificationService.failure(
              'USER_EDIT.SINGLE_CODE_CONFIRMATION_DIALOG_CLOSED_WITHOUT_SUBMIT',
              true
            )
          } else if(result?.dialogResult === DialogResults.SUCCESS && !isDefinedNotBlank(result.code)) {
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
    this.notificationService.success('USER_EDIT.SPOKEN_LANGUAGES.SUCCESS', true)
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
    if(err.status > 500) {
      this.notificationService.failure('USER_EDIT.REQUEST_CREATION_SERVER_SIDE_ERROR', true)
    }
  }

  private handleRequestCreationError(err: unknown): Observable<never> {
    if(err instanceof HttpErrorResponse) {
      this.handleRequestCreationHttpErrorResponse(err)
    }
    return EMPTY
  }

  private handleValidFormSubmit(readOnlyLanguages: readonly ReadOnlyLanguage[]) {
    this.userService.requestCurrentUserSpokenLanguagesChange$(readOnlyLanguages)
      .pipe(
        catchError(err => this.handleRequestCreationError(err)),
        mergeMap(() => this.retrieveConfirmationCode()),
        //As error has been already handled in retrieveConfirmationCode, I can continue to sending confirmation code to the server
        //When EMPTY is returned from previous function, rest of pipeline is skipped
        mergeMap((code) => this.userService.confirmCurrentUserSpokenLanguagesChange$(code)),
        first()
      )
      .subscribe({
        next: () => this.handleConfirmationSuccess(),
        error: (err) => this.handleConfirmationError(err)
      })
  }

  onSubmit(form: UserSpokenLanguagesEditFormGroup) {
    if(form.invalid) {
      //Can't really imagine how this might've happened
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.SUBMITTED_FORM_INVALID', true)
    } else if(form.pristine) {
      //Nothing has changed, return
      console.log(form.value.spokenLanguages)
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else if(form.value.spokenLanguages?.length === this.user.spokenLanguages?.length
      && containsAll(form.value.spokenLanguages ?? [], this.user.spokenLanguages ?? [])
    ) {
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else {
      this.handleValidFormSubmit(form.value.spokenLanguages ?? [])
    }
  }

}
