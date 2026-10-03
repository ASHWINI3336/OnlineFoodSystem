import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page page-content">
      <div class="auth-card card card-glass animate-scale-in">
        <div class="auth-header">
          <div class="auth-icon"><span class="material-icons">person_add</span></div>
          <h1 class="heading-display heading-4">Create Account</h1>
          <p>Join FoodieHub and start ordering</p>
        </div>
        <form (ngSubmit)="signUp()">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input type="text" class="form-input" [(ngModel)]="form.firstName" name="firstName" placeholder="John" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input type="text" class="form-input" [(ngModel)]="form.lastName" name="lastName" placeholder="Doe" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" [(ngModel)]="form.email" name="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <input type="tel" class="form-input" [(ngModel)]="form.mobileNumber" name="mobile" placeholder="+91 98765 43210" required>
          </div>
          <div class="form-group">
            <label class="form-label">Address</label>
            <input type="text" class="form-input" [(ngModel)]="form.address" name="address" placeholder="Your delivery address" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" [(ngModel)]="form.password" name="password" placeholder="Min 8 characters" required minlength="8">
          </div>
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="loading">
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/customer-login" class="auth-link highlight">Sign In</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: var(--space-lg);
      background: radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.06) 0%, transparent 60%);
    }
    .auth-card { width: 100%; max-width: 500px; padding: var(--space-2xl); border-radius: var(--radius-xl); }
    .auth-header { text-align: center; margin-bottom: var(--space-xl); }
    .auth-icon {
      width: 64px; height: 64px; margin: 0 auto var(--space-md);
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: var(--radius-lg); color: white;
    }
    .auth-icon .material-icons { font-size: 28px; }
    .auth-header h1 { margin-bottom: var(--space-xs); color: var(--text-primary); }
    .auth-header p { color: var(--text-secondary); font-size: var(--text-sm); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
    .auth-footer { text-align: center; margin-top: var(--space-lg); }
    .auth-link { color: var(--text-secondary); font-size: var(--text-sm); transition: color var(--transition-fast); }
    .auth-link:hover, .auth-link.highlight { color: var(--primary); font-weight: 600; }
    .auth-footer p { font-size: var(--text-sm); color: var(--text-secondary); }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class CustomerRegisterComponent {
  form = { firstName: '', lastName: '', email: '', mobileNumber: '', address: '', password: '' };
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  signUp(): void {
    this.loading = true;
    this.auth.customerSignUp(this.form).subscribe({
      next: (res: any) => {
        if (res?.customerId) {
          this.toast.success('Account created! Please sign in.');
          this.router.navigate(['/customer-login']);
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Registration failed. Please try again.');
        this.loading = false;
      }
    });
  }
}
