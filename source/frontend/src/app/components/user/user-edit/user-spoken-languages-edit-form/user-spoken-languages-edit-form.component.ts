import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {NotificationService} from "../../../../services/notification.service";
import {User} from "../../../../models/common/user";

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
              private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      spokenLanguages: [[...(this.user.knownLanguages ?? [])]]
    })
  }

}
