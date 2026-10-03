import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { FoodService } from '../../../core/services/food.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Order, Product } from '../../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <h1 class="heading-display heading-2">Dashboard</h1>
          <p class="text-secondary-color">Overview of your restaurant</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid stagger-children">
          <div class="stat-card card card-body">
            <div class="stat-icon orders"><span class="material-icons">receipt_long</span></div>
            <div><p class="stat-label">Total Orders</p><h2 class="stat-value">{{ orders.length }}</h2></div>
          </div>
          <div class="stat-card card card-body">
            <div class="stat-icon revenue"><span class="material-icons">payments</span></div>
            <div><p class="stat-label">Revenue</p><h2 class="stat-value">₹{{ totalRevenue }}</h2></div>
          </div>
          <div class="stat-card card card-body">
            <div class="stat-icon products"><span class="material-icons">fastfood</span></div>
            <div><p class="stat-label">Products</p><h2 class="stat-value">{{ products.length }}</h2></div>
          </div>
          <div class="stat-card card card-body">
            <div class="stat-icon avg"><span class="material-icons">trending_up</span></div>
            <div><p class="stat-label">Avg Order</p><h2 class="stat-value">₹{{ avgOrder }}</h2></div>
          </div>
        </div>

        <!-- Chart + Recent Orders -->
        <div class="dashboard-grid">
          <div class="chart-section card card-body">
            <h3 class="section-title">Order Trends</h3>
            <div class="bar-chart">
              @for (bar of chartData; track bar.label) {
                <div class="bar-col">
                  <div class="bar" [style.height.%]="bar.percent"></div>
                  <span class="bar-label">{{ bar.label }}</span>
                  <span class="bar-value">{{ bar.value }}</span>
                </div>
              }
            </div>
          </div>
          <div class="recent-orders card card-body">
            <h3 class="section-title">Recent Orders</h3>
            <div class="order-list">
              @for (order of orders.slice(0, 8); track order.orderId) {
                <div class="order-row">
                  <div>
                    <span class="order-id">#{{ order.orderId }}</span>
                    <span class="order-name">{{ order.productname }}</span>
                  </div>
                  <span class="badge" [class]="getStatusClass(order.orderStatus)">{{ order.orderStatus || 'Placed' }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { padding:var(--space-2xl) 0 var(--space-xl); }
    .page-header h1 { color:var(--text-primary); }
    .stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:var(--space-lg);margin-bottom:var(--space-xl); }
    .stat-card { display:flex;align-items:center;gap:var(--space-lg); }
    .stat-icon { width:56px;height:56px;border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;flex-shrink:0; }
    .stat-icon .material-icons { font-size:24px;color:white; }
    .stat-icon.orders { background:linear-gradient(135deg,#3B82F6,#2563EB); }
    .stat-icon.revenue { background:linear-gradient(135deg,var(--success),#059669); }
    .stat-icon.products { background:linear-gradient(135deg,var(--primary),var(--primary-dark)); }
    .stat-icon.avg { background:linear-gradient(135deg,#8B5CF6,#7C3AED); }
    .stat-label { font-size:var(--text-xs);color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em; }
    .stat-value { font-family:var(--font-display);font-size:var(--text-2xl);font-weight:800;color:var(--text-primary); }

    .dashboard-grid { display:grid;grid-template-columns:1.5fr 1fr;gap:var(--space-xl); }
    .section-title { font-size:var(--text-lg);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-lg); }

    .bar-chart { display:flex;align-items:flex-end;gap:var(--space-md);height:200px;padding-top:var(--space-md); }
    .bar-col { flex:1;display:flex;flex-direction:column;align-items:center;gap:6px; }
    .bar {
      width:100%;max-width:40px;background:linear-gradient(to top,var(--primary),var(--primary-light));
      border-radius:var(--radius-sm) var(--radius-sm) 0 0;min-height:4px;
      transition:height 0.8s cubic-bezier(0.34,1.56,0.64,1);
    }
    .bar-label { font-size:var(--text-xs);color:var(--text-tertiary); }
    .bar-value { font-size:var(--text-xs);font-weight:600;color:var(--text-primary); }

    .order-list { display:flex;flex-direction:column;gap:var(--space-sm); }
    .order-row {
      display:flex;justify-content:space-between;align-items:center;
      padding:var(--space-sm) var(--space-md);border-radius:var(--radius-sm);
      transition:background var(--transition-fast);
    }
    .order-row:hover { background:var(--bg-tertiary); }
    .order-id { font-weight:600;color:var(--text-primary);margin-right:var(--space-sm);font-size:var(--text-sm); }
    .order-name { font-size:var(--text-sm);color:var(--text-secondary); }

    @media (max-width:1024px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:768px) { .dashboard-grid { grid-template-columns:1fr; } .stats-grid { grid-template-columns:1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  totalRevenue = 0;
  avgOrder = 0;
  chartData: { label: string; value: number; percent: number }[] = [];

  constructor(private orderService: OrderService, private foodService: FoodService, private auth: AuthService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (!this.auth.isAdminLoggedIn()) { this.router.navigate(['/admin-login']); return; }
    this.loadData();
  }

  loadData(): void {
    this.orderService.getAllOrders().subscribe({
      next: (res: any) => {
        this.orders = res || [];
        this.totalRevenue = this.orders.reduce((s, o) => s + (o.totalPrice || o.quantity * o.mrpPrice || 0), 0);
        this.avgOrder = this.orders.length ? Math.round(this.totalRevenue / this.orders.length) : 0;
        this.buildChart();
      }
    });
    this.foodService.getAllProducts().subscribe({
      next: (res: any) => { this.products = res || []; }
    });
  }

  buildChart(): void {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const counts = days.map(() => Math.floor(Math.random() * 20) + 5);
    const max = Math.max(...counts, 1);
    this.chartData = days.map((label, i) => ({ label, value: counts[i], percent: (counts[i] / max) * 100 }));
  }

  getStatusClass(status: string): string {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 'badge-success';
    if (s.includes('confirm') || s.includes('prepar')) return 'badge-info';
    if (s.includes('cancel')) return 'badge-error';
    return 'badge-warning';
  }
}
