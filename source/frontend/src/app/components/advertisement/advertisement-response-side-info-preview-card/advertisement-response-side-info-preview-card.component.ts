import {Component, Input} from '@angular/core';
import {
  AdvertisementResponse,
  AdvertisementResponseSideInfoPreviewCardData
} from "../../../models/advertisement/advertisement-response";

@Component({
  selector: 'app-advertisement-response-side-info-preview-card',
  templateUrl: './advertisement-response-side-info-preview-card.component.html',
  styleUrls: ['./advertisement-response-side-info-preview-card.component.scss']
})
export class AdvertisementResponseSideInfoPreviewCardComponent {
  @Input() title: string = '';
  @Input() advertisementResponse: AdvertisementResponseSideInfoPreviewCardData = {}
}
