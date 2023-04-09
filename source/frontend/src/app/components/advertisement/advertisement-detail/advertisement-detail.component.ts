import {Component} from '@angular/core';
import {Advertisement} from "../../../models/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, catchError, filter, first, map, mergeMap, Observable} from "rxjs";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {HttpErrorResponse} from "@angular/common/http";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {MatDialog} from "@angular/material/dialog";
import {User} from "../../../models/common/user";
import {UserService} from "../../../services/user.service";
import {AdvertisementResponse} from "../../../models/advertisement/advertisement-response";
import {AdvertisedItemInfoDialogComponent} from "../advertised-item-info-dialog/advertised-item-info-dialog.component";
import {v4 as uuidv4} from 'uuid'
import {PageRequest} from "../../../models/pagination/page-request";
import {PageInfo} from "../../../models/pagination/page";
import {pageFromItems} from "../../../utils/page-utils";
import {AdvertisementItem} from "../../../models/advertisement/advertisement-item";


@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent {
  advertisementDetail?: Advertisement
  advertiser?: User
  initialAdvertisementResponse?: AdvertisementResponse
  pageInfo: PageInfo = {idx: 0, size: 5, totalItemsAvailable: 4}
  advertisedItemsPageValues = new BehaviorSubject<AdvertisementItem[]>([])

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
        if (advertisementDetail) {
          this.initialAdvertisementResponse = this.createInitialAdvertisementResponse(advertisementDetail)
          const page = pageFromItems(advertisementDetail.listedItems, {
            idx: this.pageInfo.idx,
            size: this.pageInfo.size
          })
          this.pageInfo = page
          this.advertisedItemsPageValues.next(page.items)
        }
        this.retrieveRatedUser();
      })
  }

  showListedItemDetail(listedItem: AdvertisementItem) {
    this.matDialog.open(AdvertisedItemInfoDialogComponent, {data: listedItem})
  }

  private createInitialAdvertisementResponse(advertisement: Advertisement): AdvertisementResponse {
    const response: AdvertisementResponse = {
      advertisement: advertisement,
      //Copying items instead of simply putting original through, so we don't edit the same reference
      listedItems: advertisement.listedItems.map(listedItem => ({
        //Generate random ID, as listed item is not present in database,
        // and the ID is used just to identify object in table
        id: uuidv4(),
        resource: listedItem.resource,
        amount: listedItem.amount,
        description: ''
      }))
    }
    this.userService.currentUser$()
      .pipe(first())
      .subscribe(user => response.responder = user)
    return response
  }

  private retrieveRatedUser() {
    if (this.advertisementDetail?.authorId !== undefined) {
      this.userService.getUser$(this.advertisementDetail?.authorId)
        .subscribe({
          next: user => {
            this.advertiser = user
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

  onListedItemsPageChange(pageRequest: PageRequest) {
    this.pageInfo = {
      ...this.pageInfo,
      ...pageRequest,
    }
    this.advertisedItemsPageValues
      .next(pageFromItems(this.advertisementDetail?.listedItems ?? [], pageRequest).items)
    console.dir(this.advertisedItemsPageValues.value)
  }

  get currentListedItemsPage$(): Observable<AdvertisementItem[]> {
    return this.advertisedItemsPageValues.asObservable()
  }

  get shareButtonsLink(): string {
    return window.location.href
  }
}
