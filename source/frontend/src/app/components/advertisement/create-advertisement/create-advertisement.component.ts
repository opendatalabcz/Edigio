import {Component, OnInit} from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, first, mergeMap, Observable, of, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {NotificationService} from "../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../models/advertisement/advertisement-template-filter";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Advertisement, AdvertisementType} from "../../../models/advertisement/advertisement";
import {requireDefinedNotEmpty} from "../../../utils/assertions/array-assertions";
import {requireNotNull, requireType} from "../../../utils/assertions/object-assertions";
import {isNotNullOrUndefined} from "../../../utils/predicates/object-predicates";
import {isValidAdvertisementType} from "../../../utils/advertisement-utils";

interface CreateAdvertisementFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
}

@UntilDestroy(this)
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent implements OnInit {

  templates$: BehaviorSubject<AdvertisementTemplate[]> = new BehaviorSubject<AdvertisementTemplate[]>([])
  templatesLoading = false;
  readonly formControlsNames = {advertisementType: 'advertisementType'}

  private _form?: FormGroup
  get form() : FormGroup {
    if(!this._form) {
      throw new Error('Unitialized form retrieval!')
    }
    return this._form
  }

  private _formControls?: CreateAdvertisementFormControls;
  get formControls() : CreateAdvertisementFormControls {
    if(!this._formControls) {
      throw new Error('Unitialized form controls retrieval!')
    }
    return this._formControls
  }


  private templatesFilter$: BehaviorSubject<AdvertisementTemplateFilter>;
  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService,
              private fb: FormBuilder) {
    this.templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})
    this.setupForm()
  }

  ngOnInit() {
    this.templatesFilter$
      .pipe(
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => this.advertisementTemplateService.findTemplatesByFilter(updatedFilter)),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
  }

  private setupForm() : void {
    const form = this._form = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(AdvertisementType.OFFER)
    })
    this._formControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType))
    }
  }

  selectTemplate(template: AdvertisementTemplate) {
    this.multilingualTextService.toLocalizedTextForCurrentLanguage$(template.name)
      .pipe(first())
      .subscribe(translation => {
        this.notificationService.success(
          "CREATE_ADVERTISEMENT.TEMPLATES.SUCCESSFULLY_APPLIED",
          true,
          {templateName: translation.text}
        )
      })
  }

  onNameFilterChange(nameFilter: string) {
    this.templatesFilter$.next(
      {
        ...this.templatesFilter$.value,
        name: this.multilingualTextService.createLocalizedTextForCurrentLang(nameFilter)
      })
  }

  onSubmit() {
    isValidAdvertisementType(this.formControls.advertisementType.value)
  }

  onTypeChanged(type: AdvertisementType) {
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      advertisementTypes: [type]
    })
  }
}
