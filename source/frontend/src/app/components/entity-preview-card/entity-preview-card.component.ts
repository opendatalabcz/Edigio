import {Component, Input} from '@angular/core';
import {isObjectNotNullOrUndefined} from "../../shared/predicates/object-predicates";

@Component({
  selector: 'app-entity-preview-card',
  templateUrl: './entity-preview-card.component.html',
  styleUrls: ['./entity-preview-card.component.scss']
})
export class EntityPreviewCardComponent {
  @Input() title?: string
  @Input() maxRating: number = 5
  @Input() currentRating?: number
  @Input() reviewsLink?: any[]
  @Input() imgUrl?: string
  @Input() hoverEffectActive = true

  get showRating(): any {
    return isObjectNotNullOrUndefined(this.currentRating) && isObjectNotNullOrUndefined(this.reviewsLink)
  };
}
