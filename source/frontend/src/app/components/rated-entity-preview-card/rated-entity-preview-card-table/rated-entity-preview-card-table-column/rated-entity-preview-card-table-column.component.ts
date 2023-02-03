import {Component, HostBinding, Input} from '@angular/core';

@Component({
  selector: 'app-rated-entity-preview-card-table-column',
  template: '<ng-content></ng-content>',
  styleUrls: ['./rated-entity-preview-card-table-column.component.scss']
})
export class RatedEntityPreviewCardTableColumnComponent {
  @HostBinding('class.text-right')
  @HostBinding('class.text-medium')
  @Input() isKeyColumn?: boolean
}
