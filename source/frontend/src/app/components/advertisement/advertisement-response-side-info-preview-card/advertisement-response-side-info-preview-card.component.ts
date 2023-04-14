import {Component, Input} from '@angular/core';
import {AdvertisementResponseSideInfoPreviewCardData} from "../../../models/advertisement/advertisement-response";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";

@Component({
  selector: 'app-advertisement-response-side-info-preview-card',
  templateUrl: './advertisement-response-side-info-preview-card.component.html',
  styleUrls: ['./advertisement-response-side-info-preview-card.component.scss']
})
export class AdvertisementResponseSideInfoPreviewCardComponent {
  @Input() title: string = '';
  @Input() advertisementResponse: AdvertisementResponseSideInfoPreviewCardData = {}

  get advertisementStateTranslationKey(): string {
    return isObjectNotNullOrUndefined(this.advertisementResponse.status)
      ? `ADVERTISEMENT_RESPONSE.STATE.${this.advertisementResponse.status.toUpperCase()}` : ""
  }
}
