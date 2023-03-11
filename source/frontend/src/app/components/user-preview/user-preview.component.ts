import {Component, Input} from '@angular/core';
import {RatedUser} from "../../models/common/user";

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.scss']
})
export class UserPreviewComponent {
  private _ratedUser?: RatedUser
  @Input() title: string = '';

  public get ratedUser(): RatedUser {
    if(!this._ratedUser) {
      throw new Error('User is not initialized!')
    }
    return this._ratedUser;
  }

  @Input() public set ratedUser(ratedUser: RatedUser) {
    this._ratedUser = ratedUser;
  }

  get hasName() : boolean {
    return !!this.ratedUser.firstname || !!this.ratedUser.lastname
  }

  get firstnameAndLastname() : string | undefined {
    return this.hasName ? `${this.ratedUser.firstname ?? ''} ${this.ratedUser.lastname ?? ''}` : undefined
  }

  get spokenLanguagesRowText() : string | undefined {
    return this.ratedUser.spokenLanguages ? this.ratedUser.spokenLanguages.map(lang => lang.name).join(', ') : undefined
  }
}
