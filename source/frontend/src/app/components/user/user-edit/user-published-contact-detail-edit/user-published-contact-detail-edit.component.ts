import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../../models/common/contact";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
import {
  UserEditSingleCodeConfirmationDialogData
} from "../user-edit-single-code-confirmation-dialog/user-edit-single-code-confirmation-dialog.component";
import {universalHttpErrorResponseHandler} from "../../../../utils/error-handling-functions";
import {Router} from "@angular/router";

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

  get publishedContactDetailForm(): PublishedContactDetailFormGroup {
    return requireDefinedNotNull(this._publishedContactDetailForm)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private userService: UserService,
              private router: Router
  ) {
  }

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

  private handleSuccess() {
    this.notificationService.success('USER_EDIT.PUBLISHED_CONTACT.SUCCESS', true)
  }

  private handleValidFormSubmit(publishedContactDetailSettings: PublishedContactDetailSettings) {
    this.userService.requestCurrentUserPublishedContactDetailsSettingsChange$(publishedContactDetailSettings)
      .subscribe({
        next: () => this.handleSuccess(),
        error: (err) => universalHttpErrorResponseHandler(err, this.router)
      })
  }

  onSubmit(form: PublishedContactDetailFormGroup) {
    if (form.invalid) {
      //Can't really imagine how this might've happened
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.SUBMITTED_FORM_INVALID', true)
    } else if (form.pristine) {
      //Nothing has changed, return
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else if (!form.value.publishedContactDetail?.firstname) {
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.FIRSTNAME_CHANGED', true)
    } else {
      this.handleValidFormSubmit(form.value.publishedContactDetail)
    }
  }
}
