import {Component, forwardRef} from '@angular/core';
import {
  AbstractMultilingualTextBasedInputComponent
} from "../abstract-multilingual-text-based-input/abstract-multilingual-text-based-input.component";
import {UntilDestroy} from "@ngneat/until-destroy";
import {NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";

@UntilDestroy(this)
@Component({
  selector: 'app-multilingual-textarea',
  templateUrl: './multilingual-textarea.component.html',
  styleUrls: ['./multilingual-textarea.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultilingualTextareaComponent),
    multi: true
  },{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MultilingualTextareaComponent),
    multi: true
  }]
})
export class MultilingualTextareaComponent extends AbstractMultilingualTextBasedInputComponent{}
