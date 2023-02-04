import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Advertisement, AdvertisementType} from "../../../models/projects/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, first, forkJoin, map, mergeMap} from "rxjs";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {HttpErrorResponse} from "@angular/common/http";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {MatDialog} from "@angular/material/dialog";
import {ListedItem} from "../../../models/projects/advertisement/resource";
import {ListedItemInfoDialogComponent} from "../listed-item-info-dialog/listed-item-info-dialog.component";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {RatedUser} from "../../../models/common/user";
import {UserService} from "../../../services/user.service";
import {isNotNullOrUndefined} from "../../../utils/predicates/object-predicates";


@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent implements AfterViewInit{
  advertisementDetail?: Advertisement
  listedItemsDataSource : MatTableDataSource<ListedItem> = new MatTableDataSource()
  ratedUser?: RatedUser

  @ViewChild(MatSort) sort?: MatSort;

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
        this.listedItemsDataSource = new MatTableDataSource(this.advertisementDetail?.listedItems)
        this.listedItemsDataSource.sort = this.sort ?? null;
        this.retrieveRatedUser();
      })
  }

  ngAfterViewInit(): void {
    this.listedItemsDataSource.sort = this.sort ?? null
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

  get listedItemNameHeaderColumnKey() {
    return this.advertisementDetail
      ? `LISTED_ITEMS_TABLE.${this.advertisementDetail?.type.toUpperCase()}ED_ITEM_NAME` : ''
  }

  openListedItemDialog(listedItem: ListedItem) {
    this.matDialog.open(ListedItemInfoDialogComponent, {data: listedItem})
  }
}
