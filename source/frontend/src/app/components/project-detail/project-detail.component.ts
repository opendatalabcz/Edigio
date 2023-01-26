import {Component, OnInit,} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import {ProjectsUiService} from "../../services/projects-ui.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {LoadingType, NotificationService} from "../../services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";

enum DetailsPages {
  INTRO='intro', IMPORTANT_INFO='important-info', STATISTICS='stats'
}

@UntilDestroy()
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit{

  private selectedPage = DetailsPages.INTRO

  slug?: string

  constructor(
    private projectService: ProjectService,
    private projectsUiService: ProjectsUiService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectsUiService.getCurrentProjectSlug$()
      .pipe(untilDestroyed(this))
      .subscribe(slug => this.slug = slug)
    this.activatedRoute
      .queryParamMap
      .pipe(first())
      .subscribe((paramsMap) => {
        //Load subpage from query param
        //Reason for this choice instead of using simple router link was,
        // that I wanted give slug retrieved on this place further to other components
        // (to evade repeated subscriptions/unsubscriptions)
        //TODO: Think about it later, if there's more time
        const subpage: string | null = paramsMap.get('subpage')
        if(subpage) {
          this.selectedPage = subpage as DetailsPages
          if(Object.values(DetailsPages).indexOf(this.selectedPage) < 0) {
            throw new Error('Invalid subpage!')
          }
        }
      })
  }

  private selectPage(page: DetailsPages) {
    if(page != this.selectedPage) {
      this.selectedPage = page
      this.router.navigate([], {queryParams: {subpage: page}})
      this.notificationService.startLoading("NOTIFICATIONS.LOADING", true, LoadingType.LOADING)
    }
  }

  onSubpageLoadingFinished() {
    this.notificationService.stop_loading()
  }

  get introPageSelected() {
    return this.selectedPage == DetailsPages.INTRO
  }

  selectIntroPage() {
    this.selectPage(DetailsPages.INTRO)
  }

  get importantInformationPageSelected() {
    return this.selectedPage == DetailsPages.IMPORTANT_INFO
  }

  selectImportantInformationPage() {
    this.selectPage(DetailsPages.IMPORTANT_INFO)
  }

  get statisticsPageSelected() {
    return this.selectedPage == DetailsPages.STATISTICS
  }

  selectStatisticsPage() {
    this.selectPage(DetailsPages.STATISTICS)
  }
}
