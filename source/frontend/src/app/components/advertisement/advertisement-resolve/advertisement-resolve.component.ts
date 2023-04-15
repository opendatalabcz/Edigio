import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdvertisementService} from "../../../services/advertisement.service";
import {EMPTY, mergeMap} from "rxjs";
import {isObjectNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {NotificationService} from "../../../services/notification.service";

@Component({
  selector: 'app-advertisement-resolve',
  template: '',
})
export class AdvertisementResolveComponent implements OnInit {
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
          this.notificationService.failure("ADVERTISEMENT_RESOLVE.FAILURE")
          this.router.navigate(["/projects"])
          return EMPTY
        }
        return this.advertisementService.resolve(id, token)
      }))
      .subscribe({
        next: () => {
          this.notificationService.success("ADVERTISEMENT_RESOLVE.SUCCESS")
          this.router.navigate(["/projects"])
        },
        error: () => {
          this.notificationService.failure("ADVERTISEMENT_RESOLVE.FAILURE")
          this.router.navigate(["/projects"])
        }
      })
  }
}
