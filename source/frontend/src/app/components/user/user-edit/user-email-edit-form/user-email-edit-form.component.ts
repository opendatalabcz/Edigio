import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";

interface EmailEditFormControls {
  email: FormControl<string>
  repeatEmail: FormControl<string>
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
  get emailEditForm() : FormGroup<EmailEditFormControls> {
    return requireDefinedNotNull(this._emailEditForm)
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emailEditForm = this.fb.nonNullable.group({
      email: '',
      repeatEmail: ''
    })
  }


}
