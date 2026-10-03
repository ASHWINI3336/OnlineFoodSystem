import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Order } from '../../../core/models/models';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <h1 class="heading-display heading-2">My Orders</h1>
          <p class="text-secondary-color">Track and manage your orders</p>
        </div>

        @if (orders.length === 0) {
          <div class="empty-state animate-fade-in">
            <span class="material-icons empty-icon">receipt_long</span>
            <h3>No orders yet</h3>
            <p>Start ordering from our delicious menu!</p>
            <button class="btn btn-primary mt-lg" routerLink="/customer/home">Browse Menu</button>
          </div>
        } @else {
          <div class="orders-list stagger-children">
            @for (order of orders; track order.orderId) {
              <div class="order-card card">
                <div class="order-header">
                  <div>
                    <span class="order-id">#ORD-{{ order.orderId }}</span>
                    <span class="order-date">{{ order.orderedDate | date:'mediumDate' }}</span>
                  </div>
                  <span class="badge" [class]="getStatusClass(order.orderStatus)">{{ order.orderStatus || 'Placed' }}</span>
                </div>
                <div class="order-body">
                  <div class="order-item-row">
                    @if (order.image) {
                      <div class="order-item-image">
                        <img [src]="order.image" [alt]="order.productname" (error)="$any($event.target).src='https://via.placeholder.com/60x60?text=Food'">
                      </div>
                    }
                    <div class="order-item-info">
                      <h4>{{ order.productname }}</h4>
                      <p>Qty: {{ order.quantity }} × ₹{{ order.mrpPrice }}</p>
                    </div>
                    <div class="order-total">₹{{ order.totalPrice || (order.quantity * order.mrpPrice) }}</div>
                  </div>
                </div>

                <!-- Order Tracking -->
                <div class="order-tracking">
                  <div class="track-step" [class.active]="getTrackLevel(order) >= 1" [class.current]="getTrackLevel(order) === 1">
                    <div class="track-dot"><span class="material-icons">check</span></div>
                    <span class="track-label">Placed</span>
                  </div>
                  <div class="track-line" [class.active]="getTrackLevel(order) >= 2"></div>
                  <div class="track-step" [class.active]="getTrackLevel(order) >= 2" [class.current]="getTrackLevel(order) === 2">
                    <div class="track-dot"><span class="material-icons">thumb_up</span></div>
                    <span class="track-label">Confirmed</span>
                  </div>
                  <div class="track-line" [class.active]="getTrackLevel(order) >= 3"></div>
                  <div class="track-step" [class.active]="getTrackLevel(order) >= 3" [class.current]="getTrackLevel(order) === 3">
                    <div class="track-dot"><span class="material-icons">restaurant</span></div>
                    <span class="track-label">Preparing</span>
                  </div>
                  <div class="track-line" [class.active]="getTrackLevel(order) >= 4"></div>
                  <div class="track-step" [class.active]="getTrackLevel(order) >= 4" [class.current]="getTrackLevel(order) === 4">
                    <div class="track-dot"><span class="material-icons">delivery_dining</span></div>
                    <span class="track-label">Out for Delivery</span>
                  </div>
                  <div class="track-line" [class.active]="getTrackLevel(order) >= 5"></div>
                  <div class="track-step" [class.active]="getTrackLevel(order) >= 5" [class.current]="getTrackLevel(order) === 5">
                    <div class="track-dot"><span class="material-icons">check_circle</span></div>
                    <span class="track-label">Delivered</span>
                  </div>
                </div>

                <div class="order-footer">
                  @if (order.paymentStatus !== 'Paid') {
                    <button class="btn btn-primary btn-sm" (click)="goPayment(order)">
                      <span class="material-icons" style="font-size:16px">payment</span> Pay Now
                    </button>
                  } @else {
                    <span class="badge badge-success">Paid</span>
                  }
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
    .orders-list { display:flex;flex-direction:column;gap:var(--space-lg); }

    .order-card { padding:var(--space-lg);border-radius:var(--radius-lg); }
    .order-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-lg); }
    .order-id { font-weight:700;color:var(--text-primary);margin-right:var(--space-md); }
    .order-date { font-size:var(--text-sm);color:var(--text-tertiary); }
    .order-body { margin-bottom:var(--space-lg); }
    .order-item-row { display:flex;align-items:center;gap:var(--space-md); }
    .order-item-image { width:60px;height:60px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0;background:var(--bg-tertiary); }
    .order-item-image img { width:100%;height:100%;object-fit:cover; }
    .order-item-info { flex:1; }
    .order-item-info h4 { font-size:var(--text-base);font-weight:600;color:var(--text-primary); }
    .order-item-info p { font-size:var(--text-sm);color:var(--text-secondary); }
    .order-total { font-family:var(--font-display);font-size:var(--text-lg);font-weight:700;color:var(--primary); }

    /* Tracking */
    .order-tracking {
      display:flex;align-items:center;padding:var(--space-lg) 0;
      border-top:1px solid var(--border-light);border-bottom:1px solid var(--border-light);
      margin-bottom:var(--space-md);overflow-x:auto;
    }
    .track-step { display:flex;flex-direction:column;align-items:center;gap:6px;min-width:80px; }
    .track-dot {
      width:36px;height:36px;border-radius:50%;background:var(--bg-tertiary);
      display:flex;align-items:center;justify-content:center;
      border:2px solid var(--border-light);transition:all var(--transition-base);
    }
    .track-dot .material-icons { font-size:16px;color:var(--text-tertiary); }
    .track-step.active .track-dot { background:var(--success-light);border-color:var(--success); }
    .track-step.active .track-dot .material-icons { color:var(--success); }
    .track-step.current .track-dot { background:var(--primary);border-color:var(--primary);animation:pulse 2s infinite; }
    .track-step.current .track-dot .material-icons { color:white; }
    .track-label { font-size:var(--text-xs);color:var(--text-tertiary);white-space:nowrap; }
    .track-step.active .track-label { color:var(--text-primary);font-weight:600; }
    .track-line { flex:1;height:2px;background:var(--border-light);min-width:20px;transition:background var(--transition-base); }
    .track-line.active { background:var(--success); }

    .order-footer { display:flex;justify-content:flex-end;gap:var(--space-sm); }

    @media (max-width:480px) { .order-tracking { gap:4px; } .track-step { min-width:60px; } }
  `]
})
export class CustomerOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isCustomerLoggedIn()) { this.router.navigate(['/customer-login']); return; }
    this.loadOrders();
  }

  loadOrders(): void {
    const cid = this.auth.customerToken();
    if (!cid) return;
    this.orderService.getOrdersByCustomer(Number(cid)).subscribe({
      next: (res: any) => { this.orders = (res || []).reverse(); },
      error: () => { this.toast.error('Failed to load orders'); }
    });
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 'badge-success';
    if (s.includes('confirm') || s.includes('prepar')) return 'badge-info';
    if (s.includes('cancel')) return 'badge-error';
    return 'badge-warning';
  }

  getTrackLevel(order: Order): number {
    const s = (order.orderStatus || '').toLowerCase();
    if (s.includes('deliver')) return 5;
    if (s.includes('out')) return 4;
    if (s.includes('prepar')) return 3;
    if (s.includes('confirm')) return 2;
    return 1;
  }

  goPayment(order: Order): void {
    this.router.navigate(['/customer/payment', order.orderId, order.totalPrice || (order.quantity * order.mrpPrice)]);
  }
}
