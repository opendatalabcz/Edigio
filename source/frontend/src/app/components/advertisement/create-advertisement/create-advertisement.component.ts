import {Component, OnInit} from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, first, mergeMap, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {NotificationService} from "../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../models/advertisement/advertisement-template-filter";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisedItem, AdvertisementType} from "../../../models/advertisement/advertisement";
import {requireNotNull} from "../../../utils/assertions/object-assertions";
import {requireValidAdvertisementType} from "../../../utils/assertions/advertisement-assertions";
import {ProjectService} from "../../../services/project.service";

interface CreateAdvertisementFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<string, string>,
  advertisementDescription: AbstractControl<string, string>
  primaryLanguage: AbstractControl<string, string>,
  currentLanguage: AbstractControl<string, string>
}

type CreateAdvertisementFormStep = 'LISTED_ITEMS' | 'ADVERTISEMENT_DETAILS'

@UntilDestroy(this)
@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.scss']
})
export class CreateAdvertisementComponent implements OnInit {

  templates$: BehaviorSubject<AdvertisementTemplate[]> = new BehaviorSubject<AdvertisementTemplate[]>([])
  templatesLoading = false;
  readonly formControlsNames = {
    advertisementType: 'advertisementType',
    advertisementTitle: 'title',
    advertisementDescription: 'descriptions',
    primaryLanguage: 'primaryLanguage',
    currentLanguage: 'currentLanguage'
  }

  private _advertisementDetailsForm?: FormGroup
  get advertisementDetailsForm(): FormGroup {
    if (!this._advertisementDetailsForm) {
      throw new Error('Unitialized form retrieval!')
    }
    return this._advertisementDetailsForm
  }

  private _listedItemsFormControls?: CreateAdvertisementFormControls;
  get listedItemsFormControls(): CreateAdvertisementFormControls {
    if (!this._listedItemsFormControls) {
      throw new Error('Unitialized form controls retrieval!')
    }
    return this._listedItemsFormControls
  }


  private templatesFilter$: BehaviorSubject<AdvertisementTemplateFilter>;
  templateToString = (template: AdvertisementTemplate) => {
    return this.multilingualTextService.toLocalizedTextValueForCurrentLanguage$(template.name)
  }

  get advertisementType(): AdvertisementType {
    return this.listedItemsFormControls.advertisementType.value
  }

  private currentLanguage = 'cs'

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService,
              private projectService: ProjectService,
              private fb: FormBuilder) {
    this.templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})
    this.setupAdvertisementDetailsForm()
  }

  ngOnInit() {
    //Handling template filter change from one place instead of separate handling for name from search input field
    // and for advertisement type change
    this.templatesFilter$
      .pipe(
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => this.advertisementTemplateService.findTemplatesByFilter(updatedFilter)),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
    this.projectService.currentProjectCatastropheType$()
      .pipe(untilDestroyed(this))
      .subscribe(catastropheType => this.templatesFilter$.next({
        ...this.templatesFilter$.value,
        catastropheTypes: catastropheType ? [catastropheType] : []
      }))
    this.onTypeChanged(this.advertisementType)
  }

  private setupAdvertisementDetailsForm() {
    const form = this._advertisementDetailsForm = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(AdvertisementType.OFFER),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control(''),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(''),
      [this.formControlsNames.primaryLanguage]: this.fb.nonNullable.control('cs'),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control('cs'),
    })
    this._listedItemsFormControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType)),
      advertisementTitle: requireNotNull(form.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(form.get(this.formControlsNames.advertisementDescription)),
      primaryLanguage: requireNotNull(form.get(this.formControlsNames.primaryLanguage)),
      currentLanguage: requireNotNull(form.get(this.formControlsNames.currentLanguage))
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
    requireValidAdvertisementType(this.listedItemsFormControls.advertisementType.value)
  }

  onTypeChanged(type: AdvertisementType) {
    this.templatesFilter$.next({
      ...this.templatesFilter$.value,
      advertisementTypes: [type]
    })
  }

  onAdvertisementTypeLanguageChange(nextLanguage: string) {
    const previousLanguage = this.currentLanguage
    if(previousLanguage === nextLanguage) {
      return;
    }
  }

  onEdit(advertisedItem: AdvertisedItem) {

  }

  onDelete(advertisedItem: AdvertisedItem) {

  }

  onAdd() {

  }
}
