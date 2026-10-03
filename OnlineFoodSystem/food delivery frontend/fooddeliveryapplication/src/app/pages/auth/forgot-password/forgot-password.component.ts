import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-page page-content">
      <div class="auth-card card card-glass animate-scale-in">
        <div class="auth-header">
          <div class="auth-icon"><span class="material-icons">lock_reset</span></div>
          <h1 class="heading-display heading-4">Forgot Password</h1>
          <p>Enter your email to reset your password</p>
        </div>
        <form (ngSubmit)="submit()">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="you@example.com" required>
          </div>
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="!email || loading">
            {{ loading ? 'Sending...' : 'Reset Password' }}
          </button>
        </form>
        <div class="auth-footer">
          <a routerLink="/customer-login" class="auth-link">← Back to Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex;align-items:center;justify-content:center;min-height:100vh;padding:var(--space-lg);background:radial-gradient(ellipse at 50% 0%,rgba(255,107,53,0.06) 0%,transparent 60%); }
    .auth-card { width:100%;max-width:440px;padding:var(--space-2xl);border-radius:var(--radius-xl); }
    .auth-header { text-align:center;margin-bottom:var(--space-xl); }
    .auth-icon { width:64px;height:64px;margin:0 auto var(--space-md);display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:var(--radius-lg);color:white; }
    .auth-icon .material-icons { font-size:28px; }
    .auth-header h1 { margin-bottom:var(--space-xs);color:var(--text-primary); }
    .auth-header p { color:var(--text-secondary);font-size:var(--text-sm); }
    .auth-footer { text-align:center;margin-top:var(--space-lg); }
    .auth-link { font-size:var(--text-sm);color:var(--text-secondary); }
    .auth-link:hover { color:var(--primary); }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}
  submit(): void {
    this.loading = true;
    this.auth.forgotPassword({ email: this.email }).subscribe({
      next: (res: any) => {
        if (res?.customerId) { this.toast.success('Password recovery info sent!'); this.router.navigate(['/customer-login']); }
        else { this.toast.error('Email not found'); }
        this.loading = false;
      },
      error: () => { this.toast.error('Something went wrong'); this.loading = false; }
    });
  }
}
