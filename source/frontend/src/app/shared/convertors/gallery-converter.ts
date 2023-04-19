import {Injectable} from "@angular/core";
import {AppImage} from "../../models/common/gallery";
import {ImageItem} from "ng-gallery";

@Injectable({
  providedIn: 'root'
})
export class GalleryConverter {
  public appImageToImageItem(appImage: AppImage): ImageItem {
    return new ImageItem({src: appImage.itemUrl, thumb: appImage.itemUrl, alt: appImage.title})
  }
}
