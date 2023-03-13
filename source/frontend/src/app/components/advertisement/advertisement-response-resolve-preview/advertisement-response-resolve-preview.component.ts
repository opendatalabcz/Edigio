import {Component, OnInit} from '@angular/core';
import {Page, PageInfo} from "../../../models/pagination/page";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, EMPTY, first, map, mergeMap, Observable, of, tap} from "rxjs";
import {
  AdvertisementResponse,
  AdvertisementResponseSideInfoPreviewCardData
} from "../../../models/advertisement/advertisement-response";
import {AdvertisementType} from "../../../models/advertisement/advertisement";
import {oppositeAdvertisementType} from "../../../utils/advertisement-utils";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";
import {requireStringDefinedNotBlank} from "../../../utils/assertions/string-assertions";
import {AdvertisementResponseService} from "../../../services/advertisement-response.service";
import {Nullable} from "../../../utils/types/common";
import {universalHttpErrorResponseHandler} from "../../../utils/error-handling-functions";
import {SortDirection} from "../../../models/common/sort-direction";
import {ResponseItem} from "../../../models/advertisement/response-item";
import {extractPageInfo, pageFromItems} from "../../../utils/page-utils";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {HttpErrorResponse, HttpStatusCode} from "@angular/common/http";
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
import {error} from "@rxweb/reactive-form-validators";
import {
  AdvertisementResponseRejectDialogComponent, AdvertisementResponseRejectDialogResult
} from "../advertisement-response-reject-dialog/advertisement-response-reject-dialog.component";

@Component({
  selector: 'app-advertisement-response-resolve-preview',
  templateUrl: './advertisement-response-resolve-preview.component.html',
  styleUrls: ['./advertisement-response-resolve-preview.component.scss']
})
export class AdvertisementResponseResolvePreviewComponent implements OnInit {

  _response?: AdvertisementResponse;
  get response(): AdvertisementResponse {
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
              private matDialog: MatDialog) {}


  get responseRetrieved(): boolean {
    return isObjectNotNullOrUndefined(this._response)
  }

  createSideInfoCardDataForCurrentResponse() : Observable<AdvertisementResponseSideInfoPreviewCardData>{
    return this.advertisementService.getAdvertisementDetailsLinkForCurrentProject$(this.response.advertisement.id)
      .pipe(map((link) => ({
        originalAdvertisementTitleAndLink: {
          title: this.response.advertisement.title,
          inAppLink: link,
        },
        creationDate: this.response.creationDate,
        responseDate: this.response.responseDate,
        state: this.response.state
      })))
  }

  ngOnInit(): void {
    this.notificationService.startLoading("NOTIFICATIONS.LOADING", true)
    this.activatedRoute
      .paramMap
      .pipe(
        mergeMap((paramMap) => {
          //TODO: Check whether these param keys are valid after implementation on backend
          this.token = paramMap.get('tk')
          return this.retrieveResponse(
            requireStringDefinedNotBlank(paramMap.get('id')),
            this.token
          )
        }),
        tap((response) => {
          this._response = response
          this.currentPage$.next(pageFromItems(
            this.response.listedItems,
            {idx: 0, size: 5, sortDirection: SortDirection.DESCENDING}
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
    if(err instanceof HttpErrorResponse) {
      universalHttpErrorResponseHandler(err, this.router)
    }
  }

  private retrieveResponse(id: string, token: Nullable<string>) : Observable<AdvertisementResponse> {
    if(token) {
      console.log('Tokenized retrieval')
      return this.advertisementResponseService.getByIdWithToken$(id, token);
    } else{
      console.log('Other retrieval')
      //TODO: Implement this part when user authentication is a thing
      return this.advertisementResponseService.getById$(id);
    }
  }

  get oppositeAdvertisementType(): AdvertisementType {
    return oppositeAdvertisementType(this.response.advertisement.type)
  }

  get pageItems$() : Observable<ResponseItem[]>{
    return this.currentPage$.pipe(map((page) => page.items))
  }

  get pageInfo() : PageInfo {
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
    if(err instanceof HttpErrorResponse) {
      universalHttpErrorResponseHandler(err, this.router)
    }
  }

  private sendAcceptance(note?: string) : Observable<unknown>{
    if(!this.response.responseId) {
      this.notificationService.failure("UNKNOWN_ERROR", true)
      return EMPTY
    }
    if(this.token) {
      return this.advertisementResponseService.acceptWithToken$(this.response.responseId, this.token, note)
        .pipe(
          first()
        )
    } else {
      return this.advertisementResponseService.accept$(this.response.responseId, note)
        .pipe(
          first()
        )
    }
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
          if(result?.dialogResult !== ConfirmationDialogResult.CONFIRMED) {
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
    if(!this.response.responseId) {
      this.notificationService.failure("UNKNOWN_ERROR", true)
      return EMPTY
    }
    if(this.token) {
      return this.advertisementResponseService.rejectWithToken$(this.response.responseId, this.token, note)
        .pipe(
          first()
        )
    } else {
      return this.advertisementResponseService.reject$(this.response.responseId, note)
        .pipe(
          first()
        )
    }
  }

  private handleRejectSuccess() {
    this.notificationService.success("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.REJECT_SUCCESSFUL", true)
  }

  private handleRejectError(err: unknown) {
    this.notificationService.failure("ADVERTISEMENT_RESPONSE_RESOLVE_PREVIEW.REJECT_REQUEST_FAILED")
    if(err instanceof HttpErrorResponse) {
      universalHttpErrorResponseHandler(err, this.router)
    }
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
          if(result?.dialogResult !== ConfirmationDialogResult.CONFIRMED) {
            this.notificationService.failure("ADVERTISEMENT_RESPONSE.REJECT_DIALOG_RESULT.CLOSED", true)
          }
        }),
        mergeMap(result => {
          return result?.dialogResult === ConfirmationDialogResult.CONFIRMED ? this.sendRejection(result.note) : EMPTY
        }),
      )
      .subscribe({
        next: () => this.handleAcceptSuccess(),
        error: (err) => this.handleAcceptError(err)
      })
  }
}
