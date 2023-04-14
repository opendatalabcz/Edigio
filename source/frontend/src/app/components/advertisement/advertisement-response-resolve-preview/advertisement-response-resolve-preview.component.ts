import {Component, OnInit} from '@angular/core';
import {Page, PageInfo} from "../../../models/pagination/page";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, EMPTY, first, map, mergeMap, Observable, tap} from "rxjs";
import {
  AdvertisementResponse, AdvertisementResponsePreview,
  AdvertisementResponseSideInfoPreviewCardData
} from "../../../models/advertisement/advertisement-response";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {requireStringDefinedNotBlank} from "../../../utils/assertions/string-assertions";
import {AdvertisementResponseService} from "../../../services/advertisement-response.service";
import {Nullable} from "../../../utils/types/common";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {ResponseItem} from "../../../models/advertisement/response-item";
import {extractPageInfo, pageFromItems} from "../../../utils/page-utils";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {HttpErrorResponse} from "@angular/common/http";
import {NotificationService} from "../../../services/notification.service";
import {User} from "../../../models/common/user";
import {MatDialog} from "@angular/material/dialog";
import {ResponseItemInfoDialogComponent} from "../response-item-info-dialog/response-item-info-dialog.component";
import {PageRequest} from "../../../models/pagination/page-request";
import {AdvertisementService} from "../../../services/advertisement.service";
import {
  AdvertisementResponseAcceptDialogComponent,
  AdvertisementResponseAcceptDialogResult
} from "../advertisement-response-accept-dialog/advertisement-response-accept-dialog.component";
import {ConfirmationDialogResult} from "../../../models/common/dialogResults";
import {
  AdvertisementResponseRejectDialogComponent,
  AdvertisementResponseRejectDialogResult
} from "../advertisement-response-reject-dialog/advertisement-response-reject-dialog.component";

@Component({
  selector: 'app-advertisement-response-resolve-preview',
  templateUrl: './advertisement-response-resolve-preview.component.html',
  styleUrls: ['./advertisement-response-resolve-preview.component.scss']
})
export class AdvertisementResponseResolvePreviewComponent implements OnInit {

  _response?: AdvertisementResponsePreview;
  get response(): AdvertisementResponsePreview {
    return requireDefinedNotNull(this._response)
  }

  currentPage$: BehaviorSubject<Page<ResponseItem>> = new BehaviorSubject<Page<ResponseItem>>({
    idx: 0,
    size: 5,
    totalItemsAvailable: 0,
    items: [],
  })

  user: User = {};

  sideInfoCardData: AdvertisementResponseSideInfoPreviewCardData = {}

  private token: Nullable<string> = null

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              private advertisementResponseService: AdvertisementResponseService,
              private advertisementService: AdvertisementService,
              private matDialog: MatDialog) {
  }


  get responseRetrieved(): boolean {
    return isObjectNotNullOrUndefined(this._response)
  }

  createSideInfoCardDataForCurrentResponse(): Observable<AdvertisementResponseSideInfoPreviewCardData> {
    return this.advertisementService.getAdvertisementDetailsLinkForCurrentProject$(this.response.advertisement.id)
      .pipe(map((link) => ({
        originalAdvertisementTitleAndLink: {
          title: this.response.advertisement.title,
          inAppLink: link,
        },
        createdAt: this.response.createdAt,
        responseDate: this.response.resolvedAt,
        status: this.response.status
      })))
  }

  ngOnInit(): void {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true)
    this.activatedRoute
      .paramMap
      .pipe(
        mergeMap((paramMap) => {
          //TODO: Check whether these param keys are valid after implementation on backend
          this.token = paramMap.get('token')
          return this.advertisementResponseService.getPreviewById$(
            requireStringDefinedNotBlank(paramMap.get('id')),
            this.token ?? undefined
          )
        }),
        tap((response) => {
          this._response = response
          this.currentPage$.next(pageFromItems(
            this.response.listedItems,
            {idx: 0, size: 5}
          ))
        }),
        mergeMap(() => this.createSideInfoCardDataForCurrentResponse()),
        first()
      )
      .subscribe({
        next: sideInfoCardData => {
          this.sideInfoCardData = sideInfoCardData
        },
        error: (err) => this.handleResponseRetrievalError(err)
      })
      .add(() => this.notificationService.stopLoading())
  }

  private handleResponseRetrievalError(err: any) {
    if (err instanceof HttpErrorResponse) {
      universalHttpErrorResponseHandler(err, this.router)
    }
  }

  get oppositeAdvertisementType(): AdvertisementType {
    return oppositeAdvertisementType(this.response.advertisement.type)
  }

  get pageItems$(): Observable<ResponseItem[]> {
    return this.currentPage$.pipe(map((page) => page.items))
  }

  get pageInfo(): PageInfo {
    return extractPageInfo(this.currentPage$.value)
  }

  showListedItemDetail(item: ResponseItem): void {
    this.matDialog.open(ResponseItemInfoDialogComponent, {data: item})
  }

  onListedItemsPageChange(pageRequest: PageRequest) {
    this.currentPage$.next(
      pageFromItems(this.response.listedItems, pageRequest)
    )
  }

  private handleAcceptSuccess() {
    this.notificationService.success("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.ACCEPT_SUCCESSFUL", true)
  }

  private handleAcceptError(err: unknown) {
    this.notificationService.failure("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.ACCEPT_REQUEST_FAILED")
  }

  private sendAcceptance(note?: string): Observable<unknown> {
    if (!this.response.id) {
      this.notificationService.failure("UNKNOWN_ERROR", true)
      return EMPTY
    }
    return this.advertisementResponseService.acceptWithToken$(this.response.id, this.token, note)
      .pipe(
        first()
      )
  }

  accept() {
    this.matDialog.open<AdvertisementResponseAcceptDialogComponent, AdvertisementResponse, AdvertisementResponseAcceptDialogResult>(
      AdvertisementResponseAcceptDialogComponent,
      {
        data: this.response
      })
      .afterClosed()
      .pipe(
        tap(result => {
          if (result?.dialogResult !== ConfirmationDialogResult.CONFIRMED) {
            this.notificationService.failure("ADVERTISEMENT_RESPONSE.ACCEPT_DIALOG_RESULT.CLOSED", true)
          }
        }),
        mergeMap(result => {
          return result?.dialogResult === ConfirmationDialogResult.CONFIRMED ? this.sendAcceptance(result.note) : EMPTY
        }),
      )
      .subscribe({
        next: () => this.handleAcceptSuccess(),
        error: (err) => this.handleAcceptError(err)
      })
  }

  sendRejection(note?: string): Observable<unknown> {
    if (!this.response.id) {
      this.notificationService.failure("UNKNOWN_ERROR", true)
      return EMPTY
    }
    return this.advertisementResponseService.rejectWithToken$(this.response.id, this.token, note)
      .pipe(first())
  }

  private handleRejectSuccess() {
    this.notificationService.success("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.REJECT_SUCCESSFUL", true)
  }

  private handleRejectError(err: unknown) {
    this.notificationService.failure("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.REJECT_REQUEST_FAILED")
  }

  reject() {
    this.matDialog.open<AdvertisementResponseRejectDialogComponent, AdvertisementResponse, AdvertisementResponseRejectDialogResult>(
      AdvertisementResponseRejectDialogComponent,
      {
        data: this.response
      })
      .afterClosed()
      .pipe(
        tap(result => {
          if (result?.dialogResult !== ConfirmationDialogResult.CONFIRMED) {
            this.notificationService.failure("ADVERTISEMENT_RESPONSE.REJECT_DIALOG_RESULT.CLOSED", true)
          }
        }),
        mergeMap(result => {
          return result?.dialogResult === ConfirmationDialogResult.CONFIRMED ? this.sendRejection(result.note) : EMPTY
        }),
      )
      .subscribe({
        next: () => this.handleRejectSuccess(),
        error: (err) => this.handleRejectError(err)
      })
  }
}
