import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/models';
import { FoodService } from '../../../core/services/food.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <h1 class="heading-display heading-2">My Wishlist</h1>
          <p class="text-secondary-color">{{ wishlist.count() }} saved item{{ wishlist.count() !== 1 ? 's' : '' }}</p>
        </div>
        @if (wishlistProducts.length === 0) {
          <div class="empty-state animate-fade-in">
            <span class="material-icons empty-icon">favorite_border</span>
            <h3>Your wishlist is empty</h3>
            <p>Browse menu and tap the heart icon to save items</p>
            <button class="btn btn-primary mt-lg" routerLink="/customer/home">Browse Menu</button>
          </div>
        } @else {
          <div class="wishlist-grid stagger-children">
            @for (product of wishlistProducts; track product.productId) {
              <div class="product-card card">
                <div class="product-image-wrap">
                  <img [src]="product.image" [alt]="product.productname" (error)="$any($event.target).src='https://via.placeholder.com/400x200?text=Food'">
                  <button class="remove-btn" (click)="removeFromWishlist(product.productId)">
                    <span class="material-icons">favorite</span>
                  </button>
                </div>
                <div class="product-info">
                  <h3>{{ product.productname }}</h3>
                  <p class="price">₹{{ product.mrpPrice }}</p>
                  <button class="btn btn-primary btn-sm w-full" routerLink="/customer/home">Order Now</button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header { padding:var(--space-2xl) 0 var(--space-xl); }
    .page-header h1 { color:var(--text-primary); }
    .empty-state { text-align:center;padding:var(--space-4xl) 0; }
    .empty-icon { font-size:64px;color:var(--text-tertiary);margin-bottom:var(--space-md); }
    .empty-state h3 { color:var(--text-primary);margin-bottom:var(--space-sm); }
    .empty-state p { color:var(--text-secondary); }
    .wishlist-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:var(--space-lg); }
    .product-card { overflow:hidden; }
    .product-image-wrap { position:relative;height:180px;overflow:hidden;background:var(--bg-tertiary); }
    .product-image-wrap img { width:100%;height:100%;object-fit:cover; }
    .remove-btn {
      position:absolute;top:12px;right:12px;width:36px;height:36px;border-radius:50%;
      background:var(--glass-bg);backdrop-filter:blur(10px);display:flex;align-items:center;
      justify-content:center;border:none;cursor:pointer;color:var(--error);
      transition:transform var(--transition-fast);
    }
    .remove-btn:hover { transform:scale(1.15); }
    .product-info { padding:var(--space-md) var(--space-lg) var(--space-lg); }
    .product-info h3 { font-size:var(--text-base);font-weight:600;color:var(--text-primary);margin-bottom:var(--space-xs); }
    .price { font-family:var(--font-display);font-size:var(--text-lg);font-weight:700;color:var(--primary);margin-bottom:var(--space-md); }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistProducts: Product[] = [];

  constructor(public wishlist: WishlistService, private foodService: FoodService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isCustomerLoggedIn()) { this.router.navigate(['/customer-login']); return; }
    this.loadWishlistProducts();
  }

  loadWishlistProducts(): void {
    const ids = this.wishlist.items().map(i => i.productId);
    if (ids.length === 0) return;
    this.foodService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.wishlistProducts = (products || []).filter(p => ids.includes(p.productId));
      }
    });
  }

  removeFromWishlist(productId: number): void {
    this.wishlist.toggle(productId);
    this.wishlistProducts = this.wishlistProducts.filter(p => p.productId !== productId);
  }
}
