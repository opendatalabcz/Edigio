import {Component, forwardRef} from '@angular/core';
import {
  AbstractMultilingualTextBasedInputComponent
} from "../abstract-multilingual-text-based-input/abstract-multilingual-text-based-input.component";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-multilingual-text-input',
  templateUrl: './multilingual-text-input.component.html',
  styleUrls: ['./multilingual-text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultilingualTextInputComponent),
      multi: true
    },{
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultilingualTextInputComponent),
      multi: true
    }
  ]
})
export class MultilingualTextInputComponent extends AbstractMultilingualTextBasedInputComponent {

  textblur() {
    this.onTouch?.()
  }
}
