import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../shared/assertions/object-assertions";
import {NotificationService} from "../../../../services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {UserService} from "../../../../services/user.service";
import {containsAll} from "../../../../shared/utils/array-utils";
import {noCodeUserSettingsEditErrorHandler} from "../../../../shared/utils/error-handling-functions";
import {Router} from "@angular/router";

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
  private _spokenLanguages: ReadOnlyLanguage[] = []
  public get spokenLanguages(): ReadOnlyLanguage[] {
    return this._spokenLanguages
  }

  @Input()
  public set spokenLanguages(languages: ReadOnlyLanguage[]) {
    this._spokenLanguages = languages
    this._form?.patchValue({spokenLanguages: this.spokenLanguages})
  }

  _form?: UserSpokenLanguagesEditFormGroup
  set form(value: UserSpokenLanguagesEditFormGroup) {
    this._form = value
  }

  get form(): UserSpokenLanguagesEditFormGroup {
    return requireDefinedNotNull(this._form)
  }

  constructor(private fb: FormBuilder,
              private notificationService: NotificationService,
              private matDialog: MatDialog,
              private userService: UserService,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      spokenLanguages: [[...(this.spokenLanguages ?? [])]]
    })
  }

  private handleSubmissionSuccess() {
    this.notificationService.success('USER_EDIT.SPOKEN_LANGUAGES.SUCCESS', true)
  }


  private handleValidFormSubmit(readOnlyLanguages: readonly ReadOnlyLanguage[]) {
    this.notificationService.startLoading("USER_EDIT.SENDING", true)
    this.userService.requestCurrentUserSpokenLanguagesChange$(readOnlyLanguages)
      .subscribe({
        next: () => this.handleSubmissionSuccess(),
        error: (err) => noCodeUserSettingsEditErrorHandler(err, this.router, this.notificationService)
      }).add(() => this.notificationService.stopLoading())
  }

  onSubmit(form: UserSpokenLanguagesEditFormGroup) {
    if (form.invalid) {
      //Can't really imagine how this might've happened
      this.notificationService.failure('USER_EDIT.PUBLISHED_CONTACT.SUBMITTED_FORM_INVALID', true)
    } else if (form.pristine) {
      //Nothing has changed, return
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else if (form.value.spokenLanguages?.length === this.spokenLanguages?.length
      && containsAll(form.value.spokenLanguages ?? [], this.spokenLanguages ?? [])
    ) {
      this.notificationService.info('USER_EDIT.FORM_VALUE_NOT_CHANGED', true)
    } else {
      this.handleValidFormSubmit(form.value.spokenLanguages ?? [])
    }
  }

}
