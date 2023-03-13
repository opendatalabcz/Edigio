import {Component, Input} from '@angular/core';
import {
  AdvertisementResponse,
  AdvertisementResponseSideInfoPreviewCardData
} from "../../../models/advertisement/advertisement-response";
import {isDefinedNotEmpty} from "../../../utils/predicates/string-predicates";
import {isObjectNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {Nullable} from "../../../utils/types/common";

@Component({
  selector: 'app-advertisement-response-side-info-preview-card',
  templateUrl: './advertisement-response-side-info-preview-card.component.html',
  styleUrls: ['./advertisement-response-side-info-preview-card.component.scss']
})
export class AdvertisementResponseSideInfoPreviewCardComponent {
  @Input() title: string = '';
  @Input() advertisementResponse: AdvertisementResponseSideInfoPreviewCardData = {}

  get advertisementStateTranslationKey() : string {
    return isObjectNotNullOrUndefined(this.advertisementResponse.state)
      ? `ADVERTISEMENT_RESPONSE.STATE.${this.advertisementResponse.state.toUpperCase()}` : ""
  }
}
