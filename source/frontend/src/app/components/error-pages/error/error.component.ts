import {Component, Input} from '@angular/core';

export type AllowedErrorsType = '4xx' | '5xx' | 'forbidden' | 'not-found' | 'internal-server-error' | 'unknown'

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  @Input() type: AllowedErrorsType = 'unknown'

  get titleKey(): string {
    return `ERROR_PAGES.${this.type.toUpperCase()}.TITLE`
  }

  get messageKey(): string {
    return `ERROR_PAGES.${this.type.toUpperCase()}.MESSAGE`
  }
}
