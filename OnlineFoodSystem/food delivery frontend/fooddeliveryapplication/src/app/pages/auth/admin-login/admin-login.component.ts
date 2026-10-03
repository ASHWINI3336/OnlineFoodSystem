import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="auth-page page-content">
      <div class="auth-card card card-glass animate-scale-in">
        <div class="auth-header">
          <div class="auth-icon admin"><span class="material-icons">admin_panel_settings</span></div>
          <h1 class="heading-display heading-4">Admin Portal</h1>
          <p>Sign in to manage your restaurant</p>
        </div>
        <form (ngSubmit)="signIn()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="admin@foodiehub.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Enter password" required>
          </div>
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="!email || !password || loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; padding: var(--space-lg);
      background: radial-gradient(ellipse at 50% 0%, rgba(27,27,47,0.06) 0%, transparent 60%);
    }
    .auth-card { width: 100%; max-width: 440px; padding: var(--space-2xl); border-radius: var(--radius-xl); }
    .auth-header { text-align: center; margin-bottom: var(--space-xl); }
    .auth-icon {
      width: 64px; height: 64px; margin: 0 auto var(--space-md);
      display: flex; align-items: center; justify-content: center;
      border-radius: var(--radius-lg); color: white;
    }
    .auth-icon.admin { background: linear-gradient(135deg, var(--secondary), #2D2D4F); }
    .auth-icon .material-icons { font-size: 28px; }
    .auth-header h1 { margin-bottom: var(--space-xs); color: var(--text-primary); }
    .auth-header p { color: var(--text-secondary); font-size: var(--text-sm); }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  loading = false;

  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}

  signIn(): void {
    this.loading = true;
    this.auth.adminLogin({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res?.adminId) {
          this.auth.setAdminSession(res);
          this.toast.success('Welcome, Admin!');
          this.router.navigate(['/admin/home']);
        } else {
          this.toast.error('Invalid admin credentials');
        }
        this.loading = false;
      },
      error: () => {
        this.toast.error('Admin login failed.');
        this.loading = false;
      }
    });
  }
}
