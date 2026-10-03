import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/models';
import { FoodService } from '../../../core/services/food.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ReviewService } from '../../../core/services/review.service';
import { ToastService } from '../../../core/services/toast.service';
import { StarRatingComponent } from '../../../shared/star-rating/star-rating.component';

@Component({
  selector: 'app-customer-home',
  standalone: true,
  imports: [FormsModule, StarRatingComponent],
  template: `
    <div class="page-content">
      <div class="container">
        <!-- Header -->
        <div class="page-header animate-fade-in-up">
          <div>
            <h1 class="heading-display heading-2">Our Menu</h1>
            <p class="text-secondary-color">Browse and order your favorite dishes</p>
          </div>
          <div class="search-box">
            <span class="material-icons search-icon">search</span>
            <input type="text" class="form-input search-input" [(ngModel)]="searchQuery" (input)="filterProducts()" placeholder="Search food items...">
          </div>
        </div>

        <!-- Category Chips -->
        <div class="category-chips animate-fade-in">
          <button class="chip" [class.active]="selectedCategory === 100" (click)="selectCategory(100)">
            <span>🍽️</span> All
          </button>
          @for (cat of foodService.categories; track cat.value) {
            <button class="chip" [class.active]="selectedCategory === cat.value" (click)="selectCategory(cat.value)">
              <span>{{ cat.icon }}</span> {{ cat.name }}
            </button>
          }
        </div>

        <!-- Product Grid -->
        @if (filteredProducts.length === 0) {
          <div class="empty-state animate-fade-in">
            <span class="material-icons empty-icon">restaurant</span>
            <h3>No products found</h3>
            <p>Try a different category or search term</p>
          </div>
        } @else {
          <div class="product-grid stagger-children">
            @for (product of filteredProducts; track product.productId) {
              <div class="product-card card">
                <div class="product-image-wrap">
                  <img [src]="product.image" [alt]="product.productname" class="product-image" (error)="onImageError($event)">
                  <button class="wishlist-btn" (click)="wishlist.toggle(product.productId)" [class.active]="wishlist.has(product.productId)">
                    <span class="material-icons">{{ wishlist.has(product.productId) ? 'favorite' : 'favorite_border' }}</span>
                  </button>
                  @if (product.quantity <= 5 && product.quantity > 0) {
                    <span class="stock-badge badge badge-warning">Only {{ product.quantity }} left</span>
                  }
                  @if (product.quantity === 0) {
                    <span class="stock-badge badge badge-error">Out of Stock</span>
                  }
                </div>
                <div class="product-info">
                  <div class="product-header-row">
                    <h3 class="product-name">{{ product.productname }}</h3>
                    <span class="product-price">₹{{ product.mrpPrice }}</span>
                  </div>
                  <p class="product-desc">{{ product.description }}</p>
                  <div class="product-rating">
                    <app-star-rating [currentRating]="getAvgRating(product.productId)" [showCount]="true" [count]="getReviewCount(product.productId)"></app-star-rating>
                  </div>
                  <div class="product-actions">
                    <div class="qty-control">
                      <button class="qty-btn" (click)="decreaseQty(product.productId)">−</button>
                      <span class="qty-value">{{ getQty(product.productId) }}</span>
                      <button class="qty-btn" (click)="increaseQty(product.productId)">+</button>
                    </div>
                    <button class="btn btn-primary btn-sm" (click)="addToCart(product)" [disabled]="product.quantity === 0">
                      <span class="material-icons" style="font-size:16px">add_shopping_cart</span> Add
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        <!-- Pagination -->
        @if (totalItems > pageSize) {
          <div class="pagination">
            <button class="btn btn-ghost btn-sm" (click)="goPage(0)" [disabled]="currentPage === 0">
              <span class="material-icons">first_page</span>
            </button>
            <button class="btn btn-ghost btn-sm" (click)="goPage(currentPage - 1)" [disabled]="currentPage === 0">
              <span class="material-icons">chevron_left</span>
            </button>
            <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
            <button class="btn btn-ghost btn-sm" (click)="goPage(currentPage + 1)" [disabled]="currentPage >= totalPages - 1">
              <span class="material-icons">chevron_right</span>
            </button>
            <button class="btn btn-ghost btn-sm" (click)="goPage(totalPages - 1)" [disabled]="currentPage >= totalPages - 1">
              <span class="material-icons">last_page</span>
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-header { display:flex;justify-content:space-between;align-items:flex-end;padding:var(--space-2xl) 0 var(--space-xl);gap:var(--space-lg);flex-wrap:wrap; }
    .page-header h1 { color:var(--text-primary); }
    .search-box { position:relative;width:320px; }
    .search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:20px; }
    .search-input { padding-left:44px; }
    .category-chips { display:flex;gap:var(--space-sm);overflow-x:auto;padding-bottom:var(--space-md);margin-bottom:var(--space-xl); }
    .category-chips::-webkit-scrollbar { height:0; }
    .chip {
      display:flex;align-items:center;gap:6px;padding:10px 20px;
      border-radius:var(--radius-full);background:var(--bg-card);
      border:1.5px solid var(--border-light);font-size:var(--text-sm);
      font-weight:500;white-space:nowrap;transition:all var(--transition-fast);
      color:var(--text-secondary);cursor:pointer;
    }
    .chip:hover { border-color:var(--primary);color:var(--primary); }
    .chip.active { background:var(--primary);color:white;border-color:var(--primary);box-shadow:0 4px 15px var(--primary-glow); }

    .product-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:var(--space-lg); }
    .product-card { overflow:hidden; }
    .product-image-wrap { position:relative;height:200px;overflow:hidden;background:var(--bg-tertiary); }
    .product-image { width:100%;height:100%;object-fit:cover;transition:transform var(--transition-slow); }
    .product-card:hover .product-image { transform:scale(1.05); }
    .wishlist-btn {
      position:absolute;top:12px;right:12px;width:36px;height:36px;
      border-radius:50%;background:var(--glass-bg);backdrop-filter:blur(10px);
      display:flex;align-items:center;justify-content:center;
      border:none;cursor:pointer;transition:all var(--transition-fast);
      color:var(--text-secondary);
    }
    .wishlist-btn:hover,.wishlist-btn.active { color:var(--error);transform:scale(1.1); }
    .stock-badge { position:absolute;bottom:12px;left:12px; }
    .product-info { padding:var(--space-md) var(--space-lg) var(--space-lg); }
    .product-header-row { display:flex;justify-content:space-between;align-items:flex-start;gap:var(--space-sm); }
    .product-name { font-size:var(--text-base);font-weight:700;color:var(--text-primary); }
    .product-price { font-family:var(--font-display);font-size:var(--text-lg);font-weight:800;color:var(--primary);white-space:nowrap; }
    .product-desc { font-size:var(--text-xs);color:var(--text-tertiary);margin:var(--space-xs) 0;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
    .product-rating { margin:var(--space-sm) 0; }
    .product-actions { display:flex;justify-content:space-between;align-items:center;margin-top:var(--space-md); }
    .qty-control { display:flex;align-items:center;gap:0;border:1.5px solid var(--border-light);border-radius:var(--radius-sm);overflow:hidden; }
    .qty-btn { width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-tertiary);color:var(--text-primary);font-size:16px;font-weight:700;border:none;cursor:pointer;transition:background var(--transition-fast); }
    .qty-btn:hover { background:var(--primary);color:white; }
    .qty-value { width:36px;text-align:center;font-size:var(--text-sm);font-weight:600;color:var(--text-primary); }

    .empty-state { text-align:center;padding:var(--space-4xl) 0; }
    .empty-icon { font-size:64px;color:var(--text-tertiary);margin-bottom:var(--space-md); }
    .empty-state h3 { color:var(--text-primary);margin-bottom:var(--space-sm); }
    .empty-state p { color:var(--text-secondary); }

    .pagination { display:flex;justify-content:center;align-items:center;gap:var(--space-sm);padding:var(--space-2xl) 0; }
    .page-info { font-size:var(--text-sm);color:var(--text-secondary);font-weight:500; }

    @media (max-width:768px) {
      .page-header { flex-direction:column;align-items:stretch; }
      .search-box { width:100%; }
      .product-grid { grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); }
    }
  `]
})
export class CustomerHomeComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  selectedCategory = 100;
  quantities: Map<number, number> = new Map();
  customer: any = {};
  currentPage = 0;
  pageSize = 12;
  totalItems = 0;
  totalPages = 1;

  constructor(
    public foodService: FoodService,
    private cartService: CartService,
    private auth: AuthService,
    public wishlist: WishlistService,
    private reviewService: ReviewService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isCustomerLoggedIn()) { this.router.navigate(['/customer-login']); return; }
    this.loadCustomer();
    this.loadProducts();
  }

  loadCustomer(): void {
    const cid = this.auth.customerToken();
    if (cid) {
      this.auth.getCustomerById(cid).subscribe({
        next: (res: any) => { if (res?.customerId) this.customer = res; },
        error: () => {}
      });
    }
  }

  loadProducts(): void {
    const offset = this.currentPage;
    if (this.selectedCategory === 100) {
      this.foodService.getProductsPaged(offset, this.pageSize).subscribe({
        next: (res: any) => {
          this.allProducts = res?.product || [];
          this.totalItems = res?.totalProduct || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.filterProducts();
        },
        error: () => { this.toast.error('Failed to load products'); }
      });
    } else {
      this.foodService.getProductsByCategory(this.selectedCategory, offset, this.pageSize).subscribe({
        next: (res: any) => {
          this.allProducts = res?.product || [];
          this.totalItems = res?.totalProduct || 0;
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.filterProducts();
        },
        error: () => { this.toast.error('Failed to load products'); }
      });
    }
  }

  filterProducts(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredProducts = q
      ? this.allProducts.filter(p => p.productname?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
      : [...this.allProducts];
  }

  selectCategory(value: number): void {
    this.selectedCategory = value;
    this.currentPage = 0;
    this.searchQuery = '';
    this.loadProducts();
  }

  getQty(id: number): number { return this.quantities.get(id) || 1; }
  increaseQty(id: number): void { this.quantities.set(id, this.getQty(id) + 1); }
  decreaseQty(id: number): void { const q = this.getQty(id); if (q > 1) this.quantities.set(id, q - 1); }

  addToCart(product: Product): void {
    const qty = this.getQty(product.productId);
    if (qty > product.quantity) { this.toast.warning('Quantity exceeds available stock'); return; }
    const body = { quantity: qty, mrpPrice: product.mrpPrice, product, customer: this.customer };
    this.cartService.addToCart(body, product.productId, this.customer.customerId).subscribe({
      next: (res: any) => {
        if (res?.cartId) { this.toast.success(`${product.productname} added to cart!`); this.loadProducts(); }
      },
      error: () => { this.toast.error('Failed to add to cart'); }
    });
  }

  goPage(page: number): void { this.currentPage = page; this.loadProducts(); }

  getAvgRating(id: number): number { return this.reviewService.getAverageRating(id); }
  getReviewCount(id: number): number { return this.reviewService.getReviewCount(id); }

  onImageError(event: any): void { event.target.src = 'https://via.placeholder.com/400x300?text=Food+Image'; }
}
