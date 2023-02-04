import {Component, Input} from '@angular/core';
import {RatedUser} from "../../models/common/user";

@Component({
  selector: 'app-user-with-review',
  templateUrl: './user-with-review.component.html',
  styleUrls: ['./user-with-review.component.scss']
})
export class UserWithReviewComponent {
  private _ratedUser?: RatedUser

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
}
