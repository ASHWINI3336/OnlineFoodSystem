import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../core/models/models';
import { FoodService } from '../../../core/services/food.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-food-list',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <div>
            <h1 class="heading-display heading-2">Food Items</h1>
            <p class="text-secondary-color">{{ products.length }} products</p>
          </div>
          <button class="btn btn-primary" routerLink="/admin/addproduct"><span class="material-icons">add</span> Add New</button>
        </div>
        <div class="table-wrap card animate-fade-in">
          <table class="data-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of products; track p.productId) {
                <tr>
                  <td><div class="table-img"><img [src]="p.image" [alt]="p.productname" (error)="$any($event.target).src='https://via.placeholder.com/50x50?text=Food'"></div></td>
                  <td><strong>{{ p.productname }}</strong></td>
                  <td class="desc-cell">{{ p.description }}</td>
                  <td><span class="price">₹{{ p.mrpPrice }}</span></td>
                  <td>
                    <span class="badge" [class]="p.quantity > 5 ? 'badge-success' : p.quantity > 0 ? 'badge-warning' : 'badge-error'">{{ p.quantity }}</span>
                  </td>
                  <td>{{ getCategoryName(p.category) }}</td>
                  <td>
                    <div class="action-btns">
                      <button class="btn btn-ghost btn-icon" (click)="deleteProduct(p)" title="Delete">
                        <span class="material-icons">delete_outline</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          @if (products.length === 0) {
            <div class="empty-table">No products found. Add your first product!</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display:flex;justify-content:space-between;align-items:flex-end;padding:var(--space-2xl) 0 var(--space-xl);flex-wrap:wrap;gap:var(--space-md); }
    .page-header h1 { color:var(--text-primary); }
    .table-wrap { overflow-x:auto;border-radius:var(--radius-lg); }
    .table-img { width:50px;height:50px;border-radius:var(--radius-sm);overflow:hidden;background:var(--bg-tertiary); }
    .table-img img { width:100%;height:100%;object-fit:cover; }
    .desc-cell { max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-secondary); }
    .price { font-weight:700;color:var(--primary); }
    .action-btns { display:flex;gap:4px; }
    .action-btns .btn-icon { width:36px;height:36px; }
    .action-btns .btn-icon:hover { color:var(--error); }
    .empty-table { text-align:center;padding:var(--space-2xl);color:var(--text-secondary); }
  `]
})
export class AdminFoodListComponent implements OnInit {
  products: Product[] = [];

  constructor(private foodService: FoodService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isAdminLoggedIn()) { this.router.navigate(['/admin-login']); return; }
    this.loadProducts();
  }

  loadProducts(): void {
    this.foodService.getAllProducts().subscribe({
      next: (res: any) => { this.products = res || []; },
      error: () => { this.toast.error('Failed to load products'); }
    });
  }

  getCategoryName(value: any): string {
    const cat = this.foodService.categories.find(c => c.value === Number(value));
    return cat?.name || value;
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.productname}"? This cannot be undone.`)) return;
    this.foodService.deleteProduct(product.productId).subscribe({
      next: () => { this.toast.success('Product deleted'); this.loadProducts(); },
      error: () => { this.toast.error('Failed to delete'); }
    });
  }
}
