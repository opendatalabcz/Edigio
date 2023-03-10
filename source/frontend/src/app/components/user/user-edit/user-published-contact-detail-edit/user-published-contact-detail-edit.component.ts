import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../../models/common/contact";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
import {catchError, EMPTY, first, mergeMap, Observable, of, tap} from "rxjs";
import {
  UserEditSingleCodeConfirmationDialogComponent,
  UserEditSingleCodeConfirmationDialogData, UserEditSingleCodeConfirmationDialogResult
} from "../user-edit-single-code-confirmation-dialog/user-edit-single-code-confirmation-dialog.component";
import {DialogResults} from "../../../../models/common/dialogResults";
import {isDefinedNotBlank} from "../../../../utils/predicates/string-predicates";
import {MatDialog} from "@angular/material/dialog";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";

interface PublishedContactDetailFormControls {
  publishedContactDetail: FormControl<PublishedContactDetailSettings>
}

type PublishedContactDetailFormGroup = FormGroup<PublishedContactDetailFormControls>;

@Component({
  selector: 'app-user-published-contact-detail-edit',
  templateUrl: './user-published-contact-detail-edit.component.html',
  styleUrls: ['./user-published-contact-detail-edit.component.scss']
})
export class UserPublishedContactDetailEditComponent implements OnInit {
  @Input() user: User = {}
  _publishedContactDetailForm?: PublishedContactDetailFormGroup;
  private set publishedContactDetailForm(form: PublishedContactDetailFormGroup) {
    this._publishedContactDetailForm = form
  }
  get publishedContactDetailForm() : PublishedContactDetailFormGroup {
    return requireDefinedNotNull(this._publishedContactDetailForm)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private userService: UserService,
              private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this._publishedContactDetailForm = this.fb.nonNullable.group({
      publishedContactDetail: this.fb.nonNullable.control(this.user.publishedDetails ?? {})
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
    this.notificationService.success('USER_EDIT.PUBLISHED_CONTACT.SUCCESS', true)
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

  private handleValidFormSubmit(publishedContactDetailSettings: PublishedContactDetailSettings) {
    this.userService.requestCurrentUserPublishedContactDetailsSettingsChange$(publishedContactDetailSettings)
      .pipe(
        catchError(err => this.handleRequestCreationError(err)),
        mergeMap(() => this.retrieveConfirmationCode()),
        //As error has been already handled in retrieveConfirmationCode, I can continue to sending confirmation code to the server
        //When EMPTY is returned from previous function, rest of pipeline is skipped
        mergeMap((code) => this.userService.confirmCurrentUserPublishedContactDetailsSettingsChange$(code)),
        first()
      )
      .subscribe({
        next: () => this.handleConfirmationSuccess(),
        error: (err) => this.handleConfirmationError(err)
      })
  }

  onSubmit(form: PublishedContactDetailFormGroup) {
    if(form.invalid) {
      //Can't really imagine how this might've happened
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.SUBMITTED_FORM_INVALID', true)
    } else if(form.pristine) {
      //Nothing has changed, return
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else if(!form.value.publishedContactDetail?.firstname) {
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.FIRSTNAME_CHANGED', true)
    } else {
      this.handleValidFormSubmit(form.value.publishedContactDetail)
    }
  }
}
