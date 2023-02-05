import {Component} from '@angular/core';
import {Advertisement, AdvertisementType} from "../../../models/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, first, map, mergeMap} from "rxjs";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {HttpErrorResponse} from "@angular/common/http";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {MatDialog} from "@angular/material/dialog";
import {RatedUser} from "../../../models/common/user";
import {UserService} from "../../../services/user.service";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";


@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent {
  advertisementDetail?: Advertisement
  ratedUser?: RatedUser

  initialAdvertisementResponse?: AdvertisementResponse

  constructor(
    private advertisementService: AdvertisementService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private matDialog: MatDialog
  ) {
    notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('advertisementId')),
        filter(isDefinedNotEmpty),
        mergeMap(advertisementId => advertisementService.getDetailById$(advertisementId)),
        catchError((err: HttpErrorResponse) => {
          //We must not forget to stop loading here, as it wouldn't be stopped anywhere else!
          notificationService.stopLoading()
          return universalHttpErrorResponseHandler(err, router)
        }),
        first()
      )
      .subscribe(advertisementDetail => {
        this.advertisementDetail = advertisementDetail
        if(advertisementDetail) {
          this.initialAdvertisementResponse = this.createInitialAdvertisementResponse(advertisementDetail)
        }
        this.retrieveRatedUser();
      })
  }

  private createInitialAdvertisementResponse(advertisement: Advertisement) : AdvertisementResponse {
    const response : AdvertisementResponse = {
      advertisementId: advertisement.id,
      contact: {},
      //Copying items instead of simply putting original through, so we don't edit the same reference
      listedItems: advertisement.listedItems.map(listedItem => ({...listedItem}))
    }
    this.userService.currentUserContact$()
      .pipe(first())
      .subscribe(contact => response.contact = contact)
    return response
  }

  private retrieveRatedUser() {
    if(this.advertisementDetail?.authorId !== undefined) {
      this.userService.getUserRating$(this.advertisementDetail?.authorId)
        .subscribe({
          next: ratedUser => {
            this.ratedUser = ratedUser
            this.notificationService.stopLoading()
          },
          error: err => {
            this.notificationService.stopLoading()
            universalHttpErrorResponseHandler(err, this.router)
          }
        })
    } else {
      this.notificationService.stopLoading()
    }
  }
}
