import {Component, OnInit} from '@angular/core';
import {AdvertisementTemplate} from "../../../models/advertisement/advertisement-template";
import {AdvertisementTemplateService} from "../../../services/advertisement-template.service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, distinctUntilChanged, first, mergeMap, Observable, pairwise, tap} from "rxjs";
import {MultilingualTextService} from "../../../services/multilingual-text.service";
import {NotificationService} from "../../../services/notification.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {AdvertisementTemplateFilter} from "../../../models/advertisement/advertisement-template-filter";
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisedItem, AdvertisementType} from "../../../models/advertisement/advertisement";
import {requireNotNull} from "../../../utils/assertions/object-assertions";
import {requireValidAdvertisementType} from "../../../utils/assertions/advertisement-assertions";
import {ProjectService} from "../../../services/project.service";
import {Language, ReadOnlyLanguage} from "../../../models/common/language";
import {LanguageService} from "../../../services/language.service";

interface CreateAdvertisementFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<string, string>,
  advertisementDescription: AbstractControl<string, string>
  primaryLanguage: AbstractControl<string, string>,
  currentLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>
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

  get availableLanguages() : readonly ReadOnlyLanguage[] {
    return this.languagesService.readonlyAvailableLanguages
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

  private _currentLanguage$: BehaviorSubject<ReadOnlyLanguage>
  get currentLanguage$(): Observable<ReadOnlyLanguage> {
    return this._currentLanguage$.asObservable()
  }

  constructor(private advertisementTemplateService: AdvertisementTemplateService,
              private translateService: TranslateService,
              private multilingualTextService: MultilingualTextService,
              private languagesService: LanguageService,
              private notificationService: NotificationService,
              private projectService: ProjectService,
              private fb: FormBuilder) {
    this._currentLanguage$
      = new BehaviorSubject(this.languagesService.getReadOnlyLanguageByCode(this.translateService.currentLang))
    this.templatesFilter$ = new BehaviorSubject<AdvertisementTemplateFilter>({})
    this.setupAdvertisementDetailsForm()
  }

  ngOnInit() {
    //Handling template filter change from one place instead of separate handling for name from search input field
    // and for advertisement type change
    this.initTemplateFilterChangeSubscription()
    this.initCatastropheTypeSubscription()
    this.initLanguageChangeSubscription()
    this.onTypeChanged(this.advertisementType)
  }

  private initTemplateFilterChangeSubscription() {
    this.templatesFilter$
      .pipe(
        tap(() => this.templatesLoading = true),
        untilDestroyed(this),
        mergeMap((updatedFilter) => this.advertisementTemplateService.findTemplatesByFilter(updatedFilter)),
        tap(() => this.templatesLoading = false)
      )
      .subscribe((templates) => this.templates$.next(templates))
  }

  private initCatastropheTypeSubscription() {
    this.projectService.currentProjectCatastropheType$()
      .pipe(untilDestroyed(this))
      .subscribe(catastropheType => this.templatesFilter$.next({
        ...this.templatesFilter$.value,
        catastropheTypes: catastropheType ? [catastropheType] : []
      }))
  }

  private initLanguageChangeSubscription() {
    this.listedItemsFormControls.currentLanguage.valueChanges
      .pipe(
        pairwise(),
        untilDestroyed(this)
      )
      .subscribe(([prevLang, newLang]) => {
        //There's no need to save it inside this component, as localized fields are responsible for that
        this.notificationService.info(`Information in language "${prevLang.name}" saved!`)
        this._currentLanguage$.next(newLang)
      })
  }

  private setupAdvertisementDetailsForm() {
    const form = this._advertisementDetailsForm = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(AdvertisementType.OFFER),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control(''),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(''),
      [this.formControlsNames.primaryLanguage]: this.fb.nonNullable.control(this._currentLanguage$.value),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control(this._currentLanguage$.value),
    })
    this._listedItemsFormControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType)),
      advertisementTitle: requireNotNull(form.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(form.get(this.formControlsNames.advertisementDescription)),
      primaryLanguage: requireNotNull(form.get(this.formControlsNames.primaryLanguage)),
      currentLanguage: requireNotNull(form.get(this.formControlsNames.currentLanguage))
    }
    this.notificationService.info(this._currentLanguage$.value.code)
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

  onAdvertisementTypeLanguageChange(nextLanguage: ReadOnlyLanguage) {
    const previousLanguage = this._currentLanguage$.value
    if(previousLanguage === nextLanguage) {
      return;
    }
  }

  compareLangsByCode(firstLang: ReadOnlyLanguage, secondLang: ReadOnlyLanguage): boolean {
    return firstLang.code.localeCompare(secondLang.code) === 0
  }

  trackByLangCode(_index: number, lang: ReadOnlyLanguage) : string {
    return lang.code
  }

  onEdit(advertisedItem: AdvertisedItem) {

  }

  onDelete(advertisedItem: AdvertisedItem) {

  }

  onAdd() {

  }
}
