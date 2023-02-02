import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Advertisement, AdvertisementType} from "../../../models/projects/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, first, map, mergeMap} from "rxjs";
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

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent implements AfterViewInit{
  advertisementDetail?: Advertisement
  listedItemsDataSource : MatTableDataSource<ListedItem> = new MatTableDataSource()

  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
    this.listedItemsDataSource.sort = this.sort ?? null;
  }

  constructor(
    private advertisementService: AdvertisementService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
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
        notificationService.stopLoading()
      })
  }

  get listedItemNameHeaderColumnKey() {
    return this.advertisementDetail
      ? `LISTED_ITEMS_TABLE.${this.advertisementDetail?.type.toUpperCase()}ED_ITEM_NAME` : ''
  }

  openListedItemDialog(listedItem: ListedItem) {
    this.matDialog.open(ListedItemInfoDialogComponent, {data: listedItem})
  }
}
