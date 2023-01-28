import {Project, ProjectShort} from "../../models/projects/project";
import {Injectable} from "@angular/core";
import {AppGallery, AppImage} from "../../models/common/gallery";
import {ImageItem} from "ng-gallery";

@Injectable({
  providedIn: 'root'
})
export class GalleryConverter {
  public detailedToShort(project: Project) : ProjectShort {
    return {slug: project.slug, title: project.title}
  }

  public AppImageToImageItem(appImage: AppImage) : ImageItem  {
    return new ImageItem({src: appImage.itemUrl, thumb: appImage.itemUrl, alt: appImage.title})
  }
}
