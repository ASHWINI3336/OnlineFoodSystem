import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-payment',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-content">
      <div class="container">
        <div class="payment-layout animate-scale-in">
          <div class="payment-card card card-glass">
            <div class="auth-header">
              <div class="auth-icon"><span class="material-icons">payment</span></div>
              <h1 class="heading-display heading-4">Complete Payment</h1>
              <p>Order #{{ orderId }} — Total: <strong>₹{{ totalPrice }}</strong></p>
            </div>
            <form (ngSubmit)="pay()">
              <div class="form-group">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-input" [(ngModel)]="cardNumber" name="card" placeholder="4242 4242 4242 4242" required maxlength="19">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Expiry</label>
                  <input type="text" class="form-input" [(ngModel)]="expiry" name="expiry" placeholder="MM/YY" required>
                </div>
                <div class="form-group">
                  <label class="form-label">CVV</label>
                  <input type="password" class="form-input" [(ngModel)]="cvv" name="cvv" placeholder="•••" required maxlength="4">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input type="text" class="form-input" [(ngModel)]="name" name="name" placeholder="John Doe" required>
              </div>
              <button type="submit" class="btn btn-primary w-full btn-lg" [disabled]="loading">
                <span class="material-icons" style="font-size:18px">lock</span>
                {{ loading ? 'Processing...' : 'Pay ₹' + totalPrice }}
              </button>
              <p class="secure-note"><span class="material-icons" style="font-size:14px">verified_user</span> Secure payment. Your data is encrypted.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .payment-layout { display:flex;justify-content:center;padding:var(--space-2xl) 0; }
    .payment-card { width:100%;max-width:480px;padding:var(--space-2xl);border-radius:var(--radius-xl); }
    .auth-header { text-align:center;margin-bottom:var(--space-xl); }
    .auth-icon { width:64px;height:64px;margin:0 auto var(--space-md);display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border-radius:var(--radius-lg);color:white; }
    .auth-icon .material-icons { font-size:28px; }
    .auth-header h1 { margin-bottom:var(--space-xs);color:var(--text-primary); }
    .auth-header p { color:var(--text-secondary);font-size:var(--text-sm); }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md); }
    .secure-note { display:flex;align-items:center;justify-content:center;gap:6px;margin-top:var(--space-md);font-size:var(--text-xs);color:var(--text-tertiary); }
  `]
})
export class CustomerPaymentComponent implements OnInit {
  orderId = '';
  totalPrice = '';
  cardNumber = '';
  expiry = '';
  cvv = '';
  name = '';
  loading = false;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('orderId') || '';
    this.totalPrice = this.route.snapshot.paramMap.get('totalPrice') || '';
  }

  pay(): void {
    this.loading = true;
    const cid = this.auth.customerToken();
    const body = { amount: Number(this.totalPrice), paymentMethod: 'Card', paymentStatus: 'Paid' };
    this.orderService.addPayment(body, Number(this.orderId), Number(cid)).subscribe({
      next: () => { this.toast.success('Payment successful! 🎉'); this.router.navigate(['/customer/order']); this.loading = false; },
      error: () => { this.toast.error('Payment failed'); this.loading = false; }
    });
  }
}
