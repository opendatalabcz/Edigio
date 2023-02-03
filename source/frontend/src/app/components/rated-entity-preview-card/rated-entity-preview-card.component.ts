import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rated-entity-preview-card',
  templateUrl: './rated-entity-preview-card.component.html',
  styleUrls: ['./rated-entity-preview-card.component.scss']
})
export class RatedEntityPreviewCardComponent {
  @Input() title?: string
  @Input() maxRating: number = 5
  @Input() reviewsLink?: any[]
}
