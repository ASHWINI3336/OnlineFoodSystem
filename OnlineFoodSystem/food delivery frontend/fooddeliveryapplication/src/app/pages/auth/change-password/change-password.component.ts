import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="auth-page page-content">
      <div class="auth-card card card-glass animate-scale-in">
        <div class="auth-header">
          <div class="auth-icon"><span class="material-icons">vpn_key</span></div>
          <h1 class="heading-display heading-4">Change Password</h1>
          <p>Enter your new password below</p>
        </div>
        <form (ngSubmit)="submit()">
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="form-input" [(ngModel)]="password" name="password" placeholder="Min 8 characters" required minlength="8">
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <input type="password" class="form-input" [(ngModel)]="confirm" name="confirm" placeholder="Confirm password" required>
          </div>
          <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="!password || password !== confirm || loading">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
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
  `]
})
export class ChangePasswordComponent {
  password = '';
  confirm = '';
  loading = false;
  constructor(private auth: AuthService, private toast: ToastService, private router: Router) {}
  submit(): void {
    if (this.password !== this.confirm) { this.toast.error('Passwords do not match'); return; }
    this.loading = true;
    const cid = this.auth.customerToken();
    this.auth.changePassword(cid, this.password).subscribe({
      next: () => { this.toast.success('Password updated!'); this.router.navigate(['/customer/home']); this.loading = false; },
      error: () => { this.toast.error('Failed to update password'); this.loading = false; }
    });
  }
}
