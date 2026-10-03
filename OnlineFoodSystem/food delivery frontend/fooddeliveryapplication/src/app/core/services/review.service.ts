import { Injectable, signal } from '@angular/core';
import { Review } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private reviews = signal<Review[]>(this.load());

  private load(): Review[] {
    try { return JSON.parse(localStorage.getItem('reviews') || '[]'); }
    catch { return []; }
  }

  private save(): void {
    localStorage.setItem('reviews', JSON.stringify(this.reviews()));
  }

  addReview(review: Review): void {
    this.reviews.update(r => [...r, { ...review, date: new Date().toISOString() }]);
    this.save();
  }

  getReviewsForProduct(productId: number): Review[] {
    return this.reviews().filter(r => r.productId === productId);
  }

  getAverageRating(productId: number): number {
    const productReviews = this.getReviewsForProduct(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productReviews.length) * 10) / 10;
  }

  getReviewCount(productId: number): number {
    return this.getReviewsForProduct(productId).length;
  }
}
