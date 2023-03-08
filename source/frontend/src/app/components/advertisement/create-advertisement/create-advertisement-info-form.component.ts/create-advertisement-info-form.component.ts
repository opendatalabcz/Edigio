import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AdvertisementInfo, AdvertisementType} from "../../../../models/advertisement/advertisement";
import {requireDefinedNotNull, requireNotNull} from "../../../../utils/assertions/object-assertions";
import {ReadOnlyLanguage} from "../../../../models/common/language";
import {BehaviorSubject} from "rxjs";
import {LanguageService} from "../../../../services/language.service";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {NotificationService} from "../../../../services/notification.service";
import {MultilingualTextService} from "../../../../services/multilingual-text.service";
import {MultilingualText} from "../../../../models/common/multilingual-text";
import {AdvertisementHelpType} from "../../../../models/advertisement/advertisement-help-type";

interface CreateAdvertisementInfoFormControlsNames {
  advertisementType: string
  advertisementHelpType: string
  advertisementTitle: string
  advertisementDescription: string
  defaultLanguage: string
  currentLanguage: string
}

interface CreateAdvertisementInfoFormControls {
  advertisementType: AbstractControl<AdvertisementType, AdvertisementType>
  advertisementHelpType: AbstractControl<AdvertisementHelpType, AdvertisementHelpType>
  advertisementTitle: AbstractControl<MultilingualText, MultilingualText>,
  advertisementDescription: AbstractControl<MultilingualText, MultilingualText>
  defaultLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>,
  currentLanguage: AbstractControl<ReadOnlyLanguage, ReadOnlyLanguage>
}

export interface CreateAdvertisementInfoFormResult {
  advertisementInfo: AdvertisementInfo
  isValid: boolean
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
    advertisementHelpType: 'advertisementHelpType',
    advertisementTitle: 'title',
    advertisementDescription: 'description',
    currentLanguage: 'currentLanguage',
    defaultLanguage: 'primaryLanguage'
  };

  private _form?: FormGroup;

  @Input() initAdvertisementType = AdvertisementType.OFFER

  @Output() typeChange = new EventEmitter<AdvertisementType>()

  @Output() defaultLanguageChange = new EventEmitter<ReadOnlyLanguage>()

  private _defaultLanguage?: ReadOnlyLanguage
  public get defaultLanguage(): ReadOnlyLanguage {
    return requireDefinedNotNull(this._defaultLanguage)
  }
  private set defaultLanguage(lang: ReadOnlyLanguage) {
    this._defaultLanguage = lang
    this.requiredLanguagesByTitle = [lang]
  }

  requiredLanguagesByTitle: ReadOnlyLanguage[] = []

  availableLanguages: readonly ReadOnlyLanguage[] = []

  private _subform?: FormGroup

  get subform(): FormGroup {
    return requireDefinedNotNull(this._subform, 'Create advertisement info form must be initialized before use!')
  }

  private _formControls?: CreateAdvertisementInfoFormControls

  private _currentLanguage$: BehaviorSubject<ReadOnlyLanguage>

  public get currentLanguage(): ReadOnlyLanguage {
    return this._currentLanguage$.value
  }

  triedToStep = false

  constructor(private containingForm: FormGroupDirective,
              private fb: FormBuilder,
              private languageService: LanguageService,
              private multilingualTextService: MultilingualTextService,
              private notificationService: NotificationService,
              private changeDetectorRef: ChangeDetectorRef) {
    this._currentLanguage$ = new BehaviorSubject(this.languageService.instantLanguage)
    this.defaultLanguage = languageService.instantLanguage
  }

  ngOnInit() {
    this.availableLanguages = this.languageService.readonlyAvailableLanguages
    this.setupForm()
    this.initLanguageChangeSubscription()
    this.initDefaultLanguageChangeSubscription()
  }

  private initDefaultLanguageChangeSubscription() {
    this.formControls.defaultLanguage.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(lang => {
        if(lang === this._defaultLanguage) {
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
            //As this operation happens asynchronously,
            // the validity of form might be changed outside of change detection cycle.
            //Therefor we ask for change detection manually after this change
            this.changeDetectorRef.detectChanges()
          },
          () => {
            this.formControls.defaultLanguage.patchValue(this.defaultLanguage)
            this.notificationService.failure(
              "CREATE_ADVERTISEMENT.ADVERTISEMENT_INFO.LANG_CHANGE_CANCELLED_MESSAGE",
              true
            )
            //Same reason as in OK callback
            this.changeDetectorRef.detectChanges()
          }
        )
      })
  }

  private setupForm(): void {
    //Retrieve form from directive, so it can be referenced in mat stepper
    this._form = this.containingForm.form;
    //Prepare form with inputs/controls that are used to setup advertisement info
    this._subform = this.fb.group({
      [this.formControlsNames.advertisementType]: this.fb.nonNullable.control(this.initAdvertisementType),
      [this.formControlsNames.advertisementHelpType]: this.fb.nonNullable.control(null, [Validators.required]),
      [this.formControlsNames.advertisementTitle]: this.fb.nonNullable.control(
        this.multilingualTextService.emptyMultilingualTextForAllAvailableLanguages(this.instantLanguageCode)
      ),
      [this.formControlsNames.advertisementDescription]: this.fb.nonNullable.control(
        this.multilingualTextService.emptyMultilingualTextForAllAvailableLanguages(this.instantLanguageCode)
      ),
      [this.formControlsNames.defaultLanguage]: this.fb.nonNullable.control(this.languageService.instantLanguage),
      [this.formControlsNames.currentLanguage]: this.fb.nonNullable.control(this.languageService.instantLanguage),
    })
    //Prepare controls, so they can be easily referenced without need to call subform.get(...)
    // [a bit cleaner code for a cost of this boilerplate...]
    this._formControls = {
      advertisementType: requireNotNull(this.subform.get(this.formControlsNames.advertisementType)),
      advertisementHelpType: requireNotNull(this.subform.get(this.formControlsNames.advertisementHelpType)),
      advertisementTitle: requireNotNull(this.subform.get(this.formControlsNames.advertisementTitle)),
      advertisementDescription: requireNotNull(this.subform.get(this.formControlsNames.advertisementDescription)),
      defaultLanguage: requireNotNull(this.subform.get(this.formControlsNames.defaultLanguage)),
      currentLanguage: requireNotNull(this.subform.get(this.formControlsNames.currentLanguage))
    }
    //Last but not least, add the form that contains all the controls to the form that's referenced in mat-stepper
    // so it can be used by mat-step (when passed to stepControl)
    this._form.addControl('advertisementInfo', this._subform)
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
    if(this.formControls.advertisementHelpType.invalid) {
      this.notificationService.failure('Cannot submit form, one or more control invalid! Did you select advertisement help type?')
    }
  }

  onSubmit() {
    console.log(this.formControls.advertisementTitle.value)
  }

  onTypeChanged(type: AdvertisementType) {
    this.typeChange.emit(type)
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
        helpType: this.formControls.advertisementHelpType.value
      },
      isValid: this.subform.valid
    }
  }
}
