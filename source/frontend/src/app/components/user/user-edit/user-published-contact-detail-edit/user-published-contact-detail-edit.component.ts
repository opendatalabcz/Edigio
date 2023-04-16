import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../../models/common/contact";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {NotificationService} from "../../../../services/notification.service";
import {UserService} from "../../../../services/user.service";
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
  _publishedContactDetailsSettings: PublishedContactDetailSettings = {}
  @Input()
  public set publishedContactDetailsSettings(value: PublishedContactDetailSettings) {
    this._publishedContactDetailsSettings = value
    this._publishedContactDetailForm?.patchValue({publishedContactDetail: value})
  }

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
    this.publishedContactDetailForm = this.fb.nonNullable.group({
      publishedContactDetail: this.fb.nonNullable.control(this.publishedContactDetailsSettings ?? {})
    })
  }

  private handleSuccess() {
    this.notificationService.success('USER_EDIT.PUBLISHED_CONTACT.SUCCESS', true)
    this.notificationService.stopLoading()
  }

  private handleValidFormSubmit(publishedContactDetailSettings: PublishedContactDetailSettings) {
    this.notificationService.startLoading("USER_EDIT.PUBLISHED_CONTACT.SENDING", true)
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
