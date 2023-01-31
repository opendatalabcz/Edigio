import {Component} from '@angular/core';
import {Advertisement} from "../../../models/projects/advertisement/advertisement";
import {AdvertisementService} from "../../../services/advertisement.service";
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, filter, first, map, mergeMap, of} from "rxjs";
import {LoadingType, NotificationService} from "../../../services/notification.service";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-advertisement-detail',
  templateUrl: './advertisement-detail.component.html',
  styleUrls: ['./advertisement-detail.component.scss']
})
export class AdvertisementDetailComponent {
  advertisementDetail?: Advertisement

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private advertisementService: AdvertisementService,
    private notificationService: NotificationService
  ) {
    notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
    activatedRoute.paramMap
      .pipe(
        map(paramMap => paramMap.get('advertisementId')),
        filter(isDefinedNotEmpty),
        mergeMap(advertisementId => advertisementService.getDetailById$(advertisementId)),
        catchError((err: HttpErrorResponse) => {
          notificationService.stopLoading()
          if(err.status === 404) {
            router.navigate(['/not-found'])
          }
          else if(err.status === 403) {
            router.navigate(['/forbidden'])
          }
          return of(undefined)
        }),
        first()
      )
      .subscribe(advertisementDetail => {
        this.advertisementDetail = advertisementDetail
        notificationService.stopLoading()
      })
  }
}
