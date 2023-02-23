import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, Form, FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AdvertisementType} from "../../../../models/advertisement/advertisement";
import {requireDefinedNotNull, requireNotNull} from "../../../../utils/assertions/object-assertions";
import {requireDefinedNotEmpty} from "../../../../utils/assertions/array-assertions";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {BehaviorSubject, Observable, pairwise} from "rxjs";
import {LanguageService} from "../../../../services/language.service";
import {TranslateService} from "@ngx-translate/core";
import {untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "../../../../services/notification.service";

interface CreateAdvertisementInfoFormControlsNames {
  advertisementType: string
  advertisementTitle: string
  advertisementDescription: string
  primaryLanguage: string
  currentLanguage: string
}

interface CreateAdvertisementInfoFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<string, string>,
  advertisementDescription: AbstractControl<string, string>
  primaryLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>,
  currentLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>
}

@Component({
  selector: 'app-create-advertisement-info-form',
  templateUrl: './create-advertisement-info-form.component.html',
  styleUrls: ['./create-advertisement-info-form.component.scss']
})
export class CreateAdvertisementInfoFormComponent implements OnInit {

  readonly formControlsNames: CreateAdvertisementInfoFormControlsNames = {
    advertisementType: 'advertisementType',
    advertisementTitle: 'title',
    advertisementDescription: 'description',
    currentLanguage: 'currentLanguage',
    primaryLanguage: 'primaryLanguage'
  };

  private _form?: FormGroup;

  @Input() set form(value: FormGroup) {
    this._form = value
  }

  @Output() typeChange = new EventEmitter<AdvertisementType>()

  get form(): FormGroup {
    return requireDefinedNotNull(this._form, 'Create advertisement info form must be initialized before use!')
  }

  private _formControls?: CreateAdvertisementInfoFormControls

  private _currentLanguage$: BehaviorSubject<ReadOnlyLanguage>

  constructor(private fb: FormBuilder,
              private languageService: LanguageService,
              private notificationService: NotificationService) {
    this._currentLanguage$ = new BehaviorSubject(this.languageService.instantLanguage)
  }


  ngOnInit() {
    this.setupForm()
    this.initLanguageChangeSubscription()
  }

  private setupForm(): void {
    const form = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(AdvertisementType.OFFER),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control('', [Validators.required]),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(''),
      [this.formControlsNames.primaryLanguage]: this.fb.nonNullable.control('cs'),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control('cs'),
    })
    this._formControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType)),
      advertisementTitle: requireNotNull(form.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(form.get(this.formControlsNames.advertisementDescription)),
      primaryLanguage: requireNotNull(form.get(this.formControlsNames.primaryLanguage)),
      currentLanguage: requireNotNull(form.get(this.formControlsNames.currentLanguage))
    }
  }

  private initLanguageChangeSubscription() {
    this.formControls.currentLanguage.valueChanges
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

  onSubmit() {
    console.log(this.formControls.advertisementTitle.value)
  }

  onTypeChanged(type: AdvertisementType) {
    this.onTypeChanged(type)
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

  get availableLanguages() : readonly ReadOnlyLanguage[] {
    return this.languageService.readonlyAvailableLanguages
  }

  get currentLanguage$(): Observable<ReadOnlyLanguage> {
    return this._currentLanguage$.asObservable()
  }

  get formControls(): CreateAdvertisementInfoFormControls {
    return requireDefinedNotNull(
      this._formControls, 'Create advertisement info form control must not be null when used!"'
    )
  }
}
