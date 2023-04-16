import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {map, takeWhile} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.scss']
})
export class UserMainPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userService.loggedUserInfo$(false)
      .pipe(
        map(isObjectNotNullOrUndefined),
        takeWhile(isLogged => isLogged, true)
      )
      .subscribe({
        next: (isLogged) => {
          if(!isLogged) {
            this.router.navigate(["/login"])
          }
        }
      })
  }


  showPendingApprovals(): boolean {
    return true
  };

}
