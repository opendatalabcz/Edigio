import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../../services/language.service";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-terms-of-services',
  templateUrl: './terms-of-services.component.html',
  styleUrls: ['./terms-of-services.component.scss']
})
export class TermsOfServicesComponent implements OnInit {

  displayEnglishVariant: boolean = false
  displayCzechVariant: boolean = false

  constructor(private languageService: LanguageService) {
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .subscribe((lang) => {
        this.displayEnglishVariant = lang.code === LanguageService.ENGLISH_LANGUAGE_CODE
        this.displayCzechVariant = lang.code === LanguageService.CZECH_LANGUAGE_CODE
      })
  }


}
