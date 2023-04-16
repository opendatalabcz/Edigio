import {Component, OnInit} from '@angular/core';
import {AdvertisementDetail} from "../../../models/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, EMPTY, filter, first, map, mergeMap, Observable, tap} from "rxjs";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
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
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";


@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent implements OnInit {
  advertisementDetail?: AdvertisementDetail
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
  }

  ngOnInit(): void {
    this.notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    this.activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('advertisementId')),
        filter(isDefinedNotEmpty),
        mergeMap(advertisementId => this.advertisementService.getDetailById$(advertisementId)),
        tap(advertisementDetail => this.handleReceivedDetail(advertisementDetail)),
        mergeMap((advertisementDetail) => this.advertiserForDetail$(advertisementDetail)),
        first()
      )
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
  }

  private handleReceivedDetail(advertisementDetail: AdvertisementDetail) {
    this.advertisementDetail = advertisementDetail
    this.initialAdvertisementResponse = this.createInitialAdvertisementResponse(advertisementDetail)
    const page = pageFromItems(advertisementDetail.listedItems, {
      idx: this.pageInfo.idx,
      size: this.pageInfo.size
    })
    this.pageInfo = page
    this.advertisedItemsPageValues.next(page.items)
  }

  private advertiserForDetail$(advertisementDetail?: AdvertisementDetail) {
    return isObjectNotNullOrUndefined(advertisementDetail)
      ? this.userService.getUser$(advertisementDetail?.authorId) : EMPTY
  }

  showListedItemDetail(listedItem: AdvertisementItem) {
    this.matDialog.open(AdvertisedItemInfoDialogComponent, {data: listedItem})
  }

  private createInitialAdvertisementResponse(advertisement: AdvertisementDetail): AdvertisementResponse {
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
    this.userService.loggedUserDetail$()
      .pipe(first())
      .subscribe(user => response.responder = user)
    return response
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
