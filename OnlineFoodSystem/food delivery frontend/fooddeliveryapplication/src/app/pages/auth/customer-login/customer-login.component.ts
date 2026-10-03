import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page page-content">
      <div class="auth-card card card-glass animate-scale-in">
        <div class="auth-header">
          <div class="auth-icon"><span class="material-icons">person</span></div>
          <h1 class="heading-display heading-4">Welcome Back</h1>
          <p>Sign in to your account to continue</p>
        </div>
        <form (ngSubmit)="signIn()">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Enter password" required>
          </div>
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="!email || !password || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        <div class="auth-footer">
          <a routerLink="/forgot-password" class="auth-link">Forgot Password?</a>
          <p>Don't have an account? <a routerLink="/customer-register" class="auth-link highlight">Sign Up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: var(--space-lg);
      background: radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.06) 0%, transparent 60%);
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: var(--space-2xl);
      border-radius: var(--radius-xl);
    }
    .auth-header {
      text-align: center;
      margin-bottom: var(--space-xl);
    }
    .auth-icon {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: var(--radius-lg);
      color: white;
    }
    .auth-icon .material-icons { font-size: 28px; }
    .auth-header h1 { margin-bottom: var(--space-xs); color: var(--text-primary); }
    .auth-header p { color: var(--text-secondary); font-size: var(--text-sm); }
    .auth-footer {
      text-align: center;
      margin-top: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .auth-link {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }
    .auth-link:hover, .auth-link.highlight { color: var(--primary); font-weight: 600; }
    .auth-footer p { font-size: var(--text-sm); color: var(--text-secondary); }
  `]
})
export class CustomerLoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  signIn(): void {
    this.loading = true;
    this.auth.customerLogin({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res?.customerId) {
          this.auth.setCustomerSession(res);
          this.toast.success('Welcome back, ' + (res.firstName || ''));
          this.router.navigate(['/customer/home']);
        } else {
          this.toast.error('Invalid credentials');
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Login failed. Please check your credentials.');
        this.loading = false;
      }
    });
  }
}
