import {AfterContentInit, AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {map, mergeMap, Observable, of} from "rxjs";
import {ProjectService} from "../../../../services/project.service";
import {ProjectDetailsIntroPage} from "../../../../models/projects/projectPages";
import {ProjectsUiService} from "../../../../services/projects-ui.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LoadingType, NotificationService} from "../../../../services/notification.service";
import {AppGallery} from "../../../../models/common/gallery";
import {GalleryService} from "../../../../services/gallery.service";
import {GalleryComponent, GalleryItem, ImageItem} from "ng-gallery";
import {GalleryConverter} from "../../../../utils/convertors/gallery-converter";
import {image} from "@rxweb/reactive-form-validators";

@UntilDestroy()
@Component({
  selector: 'app-project-detail-intro',
  templateUrl: './project-detail-intro.component.html',
  styleUrls: ['./project-detail-intro.component.scss']
})
export class ProjectDetailIntroComponent implements OnInit {
  page?: ProjectDetailsIntroPage
  @ViewChild(GalleryComponent) galleryComponent?: GalleryComponent
  images: ImageItem[] = [];


  constructor(
    private projectService: ProjectService,
    private galleryService: GalleryService,
    private projectsUiService: ProjectsUiService,
    private notificationService: NotificationService,
    private galleryConverter: GalleryConverter
  ) {
    this.notificationService.startLoading('NOTIFICATIONS.LOADING', true, LoadingType.LOADING)
  }

  ngOnInit () {
    this.changeGallery('universal-intro-gallery')
    this.projectsUiService.currentProjectSlug$
      .pipe(
        mergeMap(slug => slug ? this.projectService.getDetailsPage(slug) : of(undefined)),
        untilDestroyed(this)
      )
      .subscribe(page => {
        console.log('cp1')
        this.page = page
        if(page) {
          this.changeGallery('universal-intro-gallery')
        } else {
          this.notificationService.stopLoading()
        }
      })
  }

  private changeGallery(gallerySlug: string) {
    this.galleryService.getImagesBySlug(gallerySlug)
      .pipe(
        map(appImages => appImages.map(img => this.galleryConverter.AppImageToImageItem(img))),
        untilDestroyed(this)
      )
      .subscribe(images => {
        this.images = images
      });

  }
}
