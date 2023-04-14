import {Component, Input} from '@angular/core';
import {User} from "../../models/common/user";
import {isArrayNullUndefinedOrEmpty} from "../../utils/array-utils";
import {isDefinedNotEmpty} from "../../utils/predicates/string-predicates";

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent {
  private _user?: User
  @Input() title: string = '';

  public get user(): User {
    if (!this._user) {
      throw new Error('User is not initialized!')
    }
    return this._user;
  }

  @Input()
  public set user(user: User) {
    this._user = user;
  }

  get hasName(): boolean {
    return !!this.user.firstname || !!this.user.lastname
  }

  get firstnameAndLastname(): string | undefined {
    return this.hasName ? `${this.user.firstname ?? ''} ${this.user.lastname ?? ''}` : undefined
  }

  get spokenLanguagesRowText(): string | undefined {
    return this.user.spokenLanguages ? this.user.spokenLanguages.map(lang => lang.name).join(', ') : undefined
  }

    protected readonly isArrayNullUndefinedOrEmpty = isArrayNullUndefinedOrEmpty;
  protected readonly isDefinedNotEmpty = isDefinedNotEmpty;
}
