import {Injectable, OnDestroy} from "@angular/core";
import {RouterStateSnapshot, TitleStrategy} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {isObjectNotNullOrUndefined} from "../predicates/object-predicates";
import {Subscription} from "rxjs";
import {Nullable} from "../types/common";

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy implements OnDestroy {
  public static TITLE_TRANSLATION_KEY_PREFIX = 'PAGES_TITLES.'
  private static TITLE_PREFIX = 'Egidio'

  private translationSubscription: Nullable<Subscription> = null

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.tryUnsubscribeTitleTranslation()
  }



  updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot)
    this.tryUnsubscribeTitleTranslation()
    if(isObjectNotNullOrUndefined(title)) {
      //We determine whether title is to be translated by checking whether it contains prefix for titles translations
      const translationExpected = title.startsWith(TranslatedTitleStrategy.TITLE_TRANSLATION_KEY_PREFIX)
      if(translationExpected) {
        //Setup default title to be in place before actual title is loaded
        this.titleService.setTitle(this.normalizeTitle())
        //Title translation is expected, therefore we must retrieve it and set
        this.translateService.stream(title).subscribe(translatedTitle => {
          this.titleService.setTitle(this.normalizeTitle(translatedTitle))
        })
      } else {
        this.titleService.setTitle(this.normalizeTitle(title))
      }
    }
  }

  private normalizeTitle(title?: string) {
    return isObjectNotNullOrUndefined(title)
      ? `${TranslatedTitleStrategy.TITLE_PREFIX} - ${title}` : TranslatedTitleStrategy.TITLE_PREFIX
  }

  private tryUnsubscribeTitleTranslation() {
    if(isObjectNotNullOrUndefined(this.translationSubscription)) {
      this.translationSubscription.unsubscribe()
    }
  }
}
