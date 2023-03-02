import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup} from "@angular/forms";
import {AdvertisementInfo, AdvertisementType} from "../../../../models/advertisement/advertisement";
import {requireDefinedNotNull, requireNotNull} from "../../../../utils/assertions/object-assertions";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {BehaviorSubject} from "rxjs";
import {LanguageService} from "../../../../services/language.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "../../../../services/notification.service";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {MultilingualText} from "../../../../models/common/multilingual-text";

interface CreateAdvertisementInfoFormControlsNames {
  advertisementType: string
  advertisementTitle: string
  advertisementDescription: string
  primaryLanguage: string
  currentLanguage: string
}

interface CreateAdvertisementInfoFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementTitle: AbstractControl<MultilingualText, MultilingualText>,
  advertisementDescription: AbstractControl<MultilingualText, MultilingualText>
  primaryLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>,
  currentLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>
}

export interface CreateAdvertisementInfoFormResult {
  advertisementInfo: AdvertisementInfo
  valid: boolean
}

@UntilDestroy()
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

  @Input() initAdvertisementType = AdvertisementType.OFFER

  @Output() typeChange = new EventEmitter<AdvertisementType>()

  @Output() defaultLanguageChange = new EventEmitter<ReadOnlyLanguage>()

  private defaultLanguage: ReadOnlyLanguage

  get form(): FormGroup {
    return requireDefinedNotNull(this._form, 'Create advertisement info form must be initialized before use!')
  }

  private _formControls?: CreateAdvertisementInfoFormControls

  private _currentLanguage$: BehaviorSubject<ReadOnlyLanguage>

  triedToStep = false

  constructor(private fb: FormBuilder,
              private languageService: LanguageService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService) {
    this._currentLanguage$ = new BehaviorSubject(this.languageService.instantLanguage)
    this.defaultLanguage = languageService.instantLanguage
    this.setupForm()
  }

  ngOnInit() {
    this.initLanguageChangeSubscription()
    this.initDefaultLanguageChangeSubscription()
  }

  private initDefaultLanguageChangeSubscription() {
    this.formControls.primaryLanguage.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(lang => {
        if(lang === this.defaultLanguage) {
          //Value was most likely reverted because of canceled confirmation, so abort
          return;
        }
        this.notificationService.confirm(
          "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.CONFIRM_DEFAULT_LANG_CHANGE.TITLE",
          "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.CONFIRM_DEFAULT_LANG_CHANGE.MESSAGE",
          "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.CONFIRM_DEFAULT_LANG_CHANGE.OK_BUTTON",
          "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.CONFIRM_DEFAULT_LANG_CHANGE.CANCEL_BUTTON",
          true,
          () => {
            this.defaultLanguage = lang
            this.defaultLanguageChange.emit(lang)
          },
          () => {
            this.notificationService.failure(
              "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.LANG_CHANGE_CANCELLED_MESSAGE",
              true
            )
          }
        )
      })
  }

  private setupForm(): void {
    const form = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(this.initAdvertisementType),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control(
        this.multilingualTextService.emptyMultilingualTextForAllAvailableLanguages(this.instantLanguageCode)
      ),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(
        this.multilingualTextService.emptyMultilingualTextForAllAvailableLanguages(this.instantLanguageCode)
      ),
      [this.formControlsNames.primaryLanguage]: this.fb.nonNullable.control(this.languageService.instantLanguage),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control(this.languageService.instantLanguage),
    })
    this._form = form
    this._formControls = {
      advertisementType: requireNotNull(form.get(this.formControlsNames.advertisementType)),
      advertisementTitle: requireNotNull(form.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(form.get(this.formControlsNames.advertisementDescription)),
      primaryLanguage: requireNotNull(form.get(this.formControlsNames.primaryLanguage)),
      currentLanguage: requireNotNull(form.get(this.formControlsNames.currentLanguage))
    }
    this.form.markAsTouched()
    this.formControls.advertisementTitle.markAsTouched()
  }

  private initLanguageChangeSubscription() {
    this.formControls.currentLanguage.valueChanges
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((newLang) => {
        //There's no need to save it inside this component, as localized fields are responsible for that
        //Only purpose for this notification is to let user know, that the input wasn't deleted,
        // but it was saved, and currently displayed values are for newly selected language
        this.notificationService.info(`Information in language "${this._currentLanguage$.value.name}" saved!`)
        this._currentLanguage$.next(newLang)
      })
  }

  preSubmit() {
    this.triedToStep = true
  }

  onSubmit() {
    console.log(this.formControls.advertisementTitle.value)
  }

  onTypeChanged(type: AdvertisementType) {
    this.typeChange.emit(type)
  }

  get primaryLanguageCode(): string {
    return this.formControls.primaryLanguage.value.code
  }

  get currentLanguageCode(): string {
    return this.formControls.currentLanguage.value.code
  }

  get availableLanguages(): readonly ReadOnlyLanguage[] {
    return this.languageService.readonlyAvailableLanguages
  }

  get availableLanguagesCodes(): string[] {
    return this.availableLanguages.map(lang => lang.code)
  }

  get instantLanguageCode(): string {
    return this._currentLanguage$.value.code
  }

  get formControls(): CreateAdvertisementInfoFormControls {
    return requireDefinedNotNull(
      this._formControls, 'Create advertisement info form control must not be null when used!"'
    )
  }

  getResult() : CreateAdvertisementInfoFormResult {
    return {
      advertisementInfo: {
        title: this.formControls.advertisementTitle.value,
        description: this.formControls.advertisementDescription.value,
        type: this.formControls.advertisementType.value,
      },
      valid: this.form.valid
    }
  }
}
