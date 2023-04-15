import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdvertisementService} from "../../../services/advertisement.service";
import {EMPTY, mergeMap} from "rxjs";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-advertisement-cancel',
  template: '',
})
export class AdvertisementCancelComponent implements OnInit {
  constructor(
    private advertisementService: AdvertisementService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(mergeMap((params) => {
        const id = params.get("advertisementId")
        const token = params.get("token") ?? undefined
        if (isObjectNullOrUndefined(id)) {
          this.notificationService.failure("ADVERTISEMENT_CANCEL.FAILURE")
          this.router.navigate(["/projects"])
          return EMPTY
        }
        console.log(`Token: ${token}`)
        return this.advertisementService.cancel(id, token)
      }))
      .subscribe({
        next: () => {
          this.notificationService.success("ADVERTISEMENT_CANCEL.SUCCESS")
          this.router.navigate(["/projects"])
        },
        error: () => {
          this.notificationService.failure("ADVERTISEMENT_CANCEL.FAILURE")
          this.router.navigate(["/projects"])
        }
      })
  }
}