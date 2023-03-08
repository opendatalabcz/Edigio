import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PublishedContactDetailSettings} from "../../../../models/common/contact";
import {requireDefinedNotNull} from "../../../../utils/assertions/object-assertions";
import {User} from "../../../../models/common/user";

interface PublishedContactDetailFormControls {
  publishedContactDetail: FormControl<PublishedContactDetailSettings>
}

@Component({
  selector: 'app-user-published-contact-detail-edit',
  templateUrl: './user-published-contact-detail-edit.component.html',
  styleUrls: ['./user-published-contact-detail-edit.component.scss']
})
export class UserPublishedContactDetailEditComponent implements OnInit {
  @Input() user: User = {}
  _publishedContactDetailForm?: FormGroup<PublishedContactDetailFormControls>;
  private set publishedContactDetailForm(form: FormGroup<PublishedContactDetailFormControls>) {
    this._publishedContactDetailForm = form
  }
  get publishedContactDetailForm() : FormGroup<PublishedContactDetailFormControls> {
    return requireDefinedNotNull(this._publishedContactDetailForm)
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this._publishedContactDetailForm = this.fb.nonNullable.group({
      publishedContactDetail: this.fb.nonNullable.control(this.user.publishedDetails ?? {})
    })
  }
}
