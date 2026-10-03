import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  template: `
    <div class="star-rating" [class.interactive]="interactive">
      @for (star of stars; track star) {
        <span class="star material-icons"
              [class.filled]="star <= (hovered || currentRating)"
              [class.half]="star - 0.5 === currentRating"
              (mouseenter)="interactive ? hovered = star : null"
              (mouseleave)="interactive ? hovered = 0 : null"
              (click)="interactive ? selectRating(star) : null">
          {{ star <= (hovered || currentRating) ? 'star' : 'star_border' }}
        </span>
      }
      @if (showCount && count > 0) {
        <span class="rating-count">({{ count }})</span>
      }
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .star {
      font-size: 18px;
      color: var(--text-tertiary);
      transition: color var(--transition-fast), transform var(--transition-fast);
    }
    .star.filled { color: var(--accent); }
    .interactive .star { cursor: pointer; }
    .interactive .star:hover { transform: scale(1.2); }
    .rating-count {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
      margin-left: 4px;
    }
  `]
})
export class StarRatingComponent {
  @Input() currentRating = 0;
  @Input() interactive = false;
  @Input() showCount = false;
  @Input() count = 0;
  @Output() ratingChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];
  hovered = 0;

  selectRating(star: number): void {
    this.currentRating = star;
    this.ratingChange.emit(star);
  }
}
