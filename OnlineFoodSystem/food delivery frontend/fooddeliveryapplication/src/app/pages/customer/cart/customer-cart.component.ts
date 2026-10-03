import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from '../../../core/models/models';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-cart',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <div class="page-header animate-fade-in-up">
          <h1 class="heading-display heading-2">Your Cart</h1>
          <p class="text-secondary-color">{{ cartList.length }} item{{ cartList.length !== 1 ? 's' : '' }} in your cart</p>
        </div>

        @if (cartList.length === 0) {
          <div class="empty-state animate-fade-in">
            <span class="material-icons empty-icon">shopping_cart</span>
            <h3>Your cart is empty</h3>
            <p>Browse our menu and add some delicious items!</p>
            <button class="btn btn-primary mt-lg" routerLink="/customer/home">Browse Menu</button>
          </div>
        } @else {
          <div class="cart-layout">
            <div class="cart-items stagger-children">
              @for (item of cartList; track item.cartId) {
                <div class="cart-item card">
                  <div class="cart-item-image">
                    <img [src]="item.product?.image" [alt]="item.product?.productname" (error)="$any($event.target).src='https://via.placeholder.com/120x120?text=Food'">
                  </div>
                  <div class="cart-item-info">
                    <h3>{{ item.product?.productname }}</h3>
                    <p class="item-price">₹{{ item.mrpPrice }} each</p>
                  </div>
                  <div class="cart-item-qty">
                    <div class="qty-control">
                      <button class="qty-btn" (click)="changeQty(item, -1)">−</button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" (click)="changeQty(item, 1)">+</button>
                    </div>
                  </div>
                  <div class="cart-item-total">
                    <span class="total-label">₹{{ item.quantity * item.mrpPrice }}</span>
                  </div>
                  <button class="btn btn-ghost btn-icon delete-btn" (click)="removeItem(item)">
                    <span class="material-icons">delete_outline</span>
                  </button>
                </div>
              }
            </div>

            <div class="cart-summary card card-glass animate-fade-in">
              <h3 class="summary-title">Order Summary</h3>
              <div class="summary-row"><span>Subtotal</span><span>₹{{ grandTotal }}</span></div>
              <div class="summary-row"><span>Delivery Fee</span><span class="text-success">Free</span></div>
              <div class="summary-divider"></div>
              <div class="summary-row total"><span>Total</span><span>₹{{ grandTotal }}</span></div>
              <button class="btn btn-primary w-full btn-lg mt-lg" (click)="placeOrder()">
                <span class="material-icons">shopping_bag</span> Place Order
              </button>
            </div>
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

    .cart-layout { display:grid;grid-template-columns:1fr 360px;gap:var(--space-xl);align-items:start; }
    .cart-items { display:flex;flex-direction:column;gap:var(--space-md); }
    .cart-item { display:flex;align-items:center;gap:var(--space-lg);padding:var(--space-md) var(--space-lg); }
    .cart-item-image { width:80px;height:80px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0;background:var(--bg-tertiary); }
    .cart-item-image img { width:100%;height:100%;object-fit:cover; }
    .cart-item-info { flex:1;min-width:0; }
    .cart-item-info h3 { font-size:var(--text-base);font-weight:600;color:var(--text-primary);margin-bottom:4px; }
    .item-price { font-size:var(--text-sm);color:var(--text-secondary); }
    .qty-control { display:flex;align-items:center;border:1.5px solid var(--border-light);border-radius:var(--radius-sm);overflow:hidden; }
    .qty-btn { width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-tertiary);color:var(--text-primary);font-size:16px;font-weight:700;border:none;cursor:pointer;transition:background var(--transition-fast); }
    .qty-btn:hover { background:var(--primary);color:white; }
    .qty-value { width:36px;text-align:center;font-size:var(--text-sm);font-weight:600; }
    .cart-item-total { min-width:80px;text-align:right; }
    .total-label { font-family:var(--font-display);font-size:var(--text-lg);font-weight:700;color:var(--primary); }
    .delete-btn { color:var(--text-tertiary);flex-shrink:0; }
    .delete-btn:hover { color:var(--error); }

    .cart-summary { padding:var(--space-xl);border-radius:var(--radius-xl);position:sticky;top:calc(var(--navbar-height) + var(--space-lg)); }
    .summary-title { font-size:var(--text-lg);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-lg); }
    .summary-row { display:flex;justify-content:space-between;font-size:var(--text-sm);color:var(--text-secondary);margin-bottom:var(--space-md); }
    .summary-row.total { font-size:var(--text-lg);font-weight:700;color:var(--text-primary);margin-bottom:0; }
    .summary-divider { height:1px;background:var(--border-light);margin:var(--space-md) 0; }

    @media (max-width:768px) {
      .cart-layout { grid-template-columns:1fr; }
      .cart-item { flex-wrap:wrap; }
      .cart-summary { position:static; }
    }
  `]
})
export class CustomerCartComponent implements OnInit {
  cartList: Cart[] = [];
  grandTotal = 0;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.auth.isCustomerLoggedIn()) { this.router.navigate(['/customer-login']); return; }
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCartList().subscribe({
      next: (res: any) => { this.cartList = res || []; this.calcTotal(); },
      error: () => { this.toast.error('Failed to load cart'); }
    });
  }

  calcTotal(): void {
    this.grandTotal = this.cartList.reduce((sum, item) => sum + (item.quantity * item.mrpPrice), 0);
  }

  changeQty(item: Cart, delta: number): void {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    item.quantity = newQty;
    this.calcTotal();
  }

  removeItem(item: Cart): void {
    this.cartService.deleteCartItem(item.cartId).subscribe({
      next: () => { this.toast.success('Item removed'); this.loadCart(); },
      error: () => { this.toast.error('Failed to remove item'); }
    });
  }

  placeOrder(): void {
    const cid = this.auth.customerToken();
    if (!cid) return;
    const orderPromises = this.cartList.map(item => {
      const body = { quantity: item.quantity, mrpPrice: item.mrpPrice, totalPrice: item.quantity * item.mrpPrice, productname: item.product?.productname, image: item.product?.image };
      return this.orderService.placeOrder(Number(cid), item.cartId, body).toPromise();
    });
    Promise.all(orderPromises).then(() => {
      this.toast.success('Order placed successfully! 🎉');
      this.router.navigate(['/customer/order']);
    }).catch(() => { this.toast.error('Failed to place order'); });
  }
}
