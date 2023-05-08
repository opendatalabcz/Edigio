import {Component, OnInit} from '@angular/core';
import {LanguageService} from "../../services/language.service";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

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
