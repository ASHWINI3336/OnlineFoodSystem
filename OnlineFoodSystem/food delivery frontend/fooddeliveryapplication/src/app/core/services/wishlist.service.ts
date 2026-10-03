import { Injectable, signal } from '@angular/core';
import { WishlistItem } from '../models/models';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  items = signal<WishlistItem[]>(this.load());

  private load(): WishlistItem[] {
    try {
      return JSON.parse(localStorage.getItem('wishlist') || '[]');
    } catch { return []; }
  }

  private save(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.items()));
  }

  toggle(productId: number): void {
    if (this.has(productId)) {
      this.items.update(items => items.filter(i => i.productId !== productId));
    } else {
      this.items.update(items => [...items, { productId, addedAt: new Date().toISOString() }]);
    }
    this.save();
  }

  has(productId: number): boolean {
    return this.items().some(i => i.productId === productId);
  }

  count(): number {
    return this.items().length;
  }
}
