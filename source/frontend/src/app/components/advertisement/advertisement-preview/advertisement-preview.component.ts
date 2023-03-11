import {Component, Input} from '@angular/core';
import {ExtendedAdvertisementInfo} from "../../../models/advertisement/advertisement";
import {requireDefinedNotNull} from "../../../utils/assertions/object-assertions";

@Component({
  selector: 'app-advertisement-preview',
  templateUrl: './advertisement-preview.component.html',
  styleUrls: ['./advertisement-preview.component.scss']
})
export class AdvertisementPreviewComponent {
  private _advertisementInfo?: ExtendedAdvertisementInfo
  @Input() set advertisementInfo(value: ExtendedAdvertisementInfo) {
    this._advertisementInfo = value
  }

  get advertisementInfo(): ExtendedAdvertisementInfo {
    return requireDefinedNotNull(this._advertisementInfo)
  }

  @Input() title: string = ''

  getHelpTypeTranslationKey() {
    return `ADVERTISEMENT.HELP_TYPE.${this.advertisementInfo.helpType.toUpperCase()}.NAME_B`
  }

  getAdvertisementTypeTranslationKey() {
    return `ADVERTISEMENT.ADVERTISEMENT_TYPE.${this.advertisementInfo.type.toUpperCase()}_B`
  }
}
