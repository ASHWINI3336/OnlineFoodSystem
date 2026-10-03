import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../../core/models/models';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <h1 class="heading-display heading-2">All Orders</h1>
          <p class="text-secondary-color">{{ orders.length }} total orders</p>
        </div>
        <div class="table-wrap card animate-fade-in">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders; track order.orderId) {
                <tr>
                  <td><strong>#{{ order.orderId }}</strong></td>
                  <td>{{ order.productname }}</td>
                  <td>{{ order.quantity }}</td>
                  <td>₹{{ order.mrpPrice }}</td>
                  <td class="price">₹{{ order.totalPrice || (order.quantity * order.mrpPrice) }}</td>
                  <td><span class="badge" [class]="getStatusClass(order.orderStatus)">{{ order.orderStatus || 'Placed' }}</span></td>
                  <td><span class="badge" [class]="order.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'">{{ order.paymentStatus || 'Pending' }}</span></td>
                  <td class="date-cell">{{ order.orderedDate }}</td>
                </tr>
              }
            </tbody>
          </table>
          @if (orders.length === 0) {
            <div class="empty-table">No orders yet.</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { padding:var(--space-2xl) 0 var(--space-xl); }
    .page-header h1 { color:var(--text-primary); }
    .table-wrap { overflow-x:auto;border-radius:var(--radius-lg); }
    .price { font-weight:700;color:var(--primary); }
    .date-cell { font-size:var(--text-xs);color:var(--text-tertiary);white-space:nowrap; }
    .empty-table { text-align:center;padding:var(--space-2xl);color:var(--text-secondary); }
  `]
})
export class AdminOrderListComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isAdminLoggedIn()) { this.router.navigate(['/admin-login']); return; }
    this.orderService.getAllOrders().subscribe({
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
}
