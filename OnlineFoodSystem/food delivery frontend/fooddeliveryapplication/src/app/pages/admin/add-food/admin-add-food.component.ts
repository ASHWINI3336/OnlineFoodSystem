import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FoodService } from '../../../core/services/food.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-add-food',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-content">
      <div class="container">
        <div class="form-layout animate-scale-in">
          <div class="form-card card card-glass">
            <div class="auth-header">
              <div class="auth-icon"><span class="material-icons">add_circle</span></div>
              <h1 class="heading-display heading-4">{{ editMode ? 'Edit' : 'Add New' }} Food Item</h1>
            </div>
            <form (ngSubmit)="submit()">
              <div class="form-group">
                <label class="form-label">Product Name</label>
                <input type="text" class="form-input" [(ngModel)]="form.productname" name="name" placeholder="e.g. Margherita Pizza" required>
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <input type="text" class="form-input" [(ngModel)]="form.description" name="desc" placeholder="Brief description" required>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select class="form-select" [(ngModel)]="form.category" name="category" required>
                    @for (cat of foodService.categories; track cat.value) {
                      <option [value]="cat.value">{{ cat.icon }} {{ cat.name }}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Measurement</label>
                  <input type="text" class="form-input" [(ngModel)]="form.measurment" name="measurement" placeholder="e.g. 1 plate">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Price (₹)</label>
                  <input type="number" class="form-input" [(ngModel)]="form.mrpPrice" name="price" placeholder="299" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Quantity</label>
                  <input type="number" class="form-input" [(ngModel)]="form.quantity" name="qty" placeholder="50" required>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Image URL</label>
                <input type="url" class="form-input" [(ngModel)]="form.image" name="image" placeholder="https://...">
              </div>
              @if (form.image) {
                <div class="image-preview">
                  <img [src]="form.image" alt="Preview" (error)="$any($event.target).style.display='none'">
                </div>
              }
              <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="loading">
                {{ loading ? 'Saving...' : (editMode ? 'Update' : 'Add') + ' Product' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-layout { display:flex;justify-content:center;padding:var(--space-2xl) 0; }
    .form-card { width:100%;max-width:560px;padding:var(--space-2xl);border-radius:var(--radius-xl); }
    .auth-header { text-align:center;margin-bottom:var(--space-xl); }
    .auth-icon { width:64px;height:64px;margin:0 auto var(--space-md);display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:var(--radius-lg);color:white; }
    .auth-icon .material-icons { font-size:28px; }
    .auth-header h1 { color:var(--text-primary); }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md); }
    .image-preview { margin-bottom:var(--space-lg);border-radius:var(--radius-md);overflow:hidden;max-height:200px; }
    .image-preview img { width:100%;height:200px;object-fit:cover; }
    @media (max-width:480px) { .form-row { grid-template-columns:1fr; } }
  `]
})
export class AdminAddFoodComponent implements OnInit {
  form: any = { productname: '', description: '', category: '0', measurment: '', mrpPrice: null, quantity: null, image: '' };
  editMode = false;
  loading = false;

  constructor(public foodService: FoodService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isAdminLoggedIn()) { this.router.navigate(['/admin-login']); return; }
  }

  submit(): void {
    this.loading = true;
    this.foodService.addProduct(this.form).subscribe({
      next: (res: any) => {
        this.toast.success('Product added successfully!');
        this.form = { productname: '', description: '', category: '0', measurment: '', mrpPrice: null, quantity: null, image: '' };
        this.loading = false;
      },
      error: () => { this.toast.error('Failed to add product'); this.loading = false; }
    });
  }
}
