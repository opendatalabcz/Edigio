import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-rated-entity-preview-card',
  templateUrl: './rated-entity-preview-card.component.html',
  styleUrls: ['./rated-entity-preview-card.component.scss']
})
export class RatedEntityPreviewCardComponent {
  @Input() title?: string
  @Input() maxRating: number = 5
  @Input() currentRating: number = 0
  @Input() reviewsLink?: any[]
  @Input() imgUrl?: string
  @Input() hoverEffectActive = true
}
