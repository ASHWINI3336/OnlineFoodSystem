import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="nav-inner container">
        <a routerLink="/" class="nav-logo">
          <span class="logo-icon">🍔</span>
          <span class="logo-text">Foodie<span class="logo-accent">Hub</span></span>
        </a>

        <!-- Guest Nav -->
        @if (!auth.isCustomerLoggedIn() && !auth.isAdminLoggedIn()) {
          <div class="nav-links" [class.open]="mobileOpen">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="closeMobile()">Home</a>
            <a routerLink="/about-us" routerLinkActive="active" (click)="closeMobile()">About</a>
            <a routerLink="/contact-us" routerLinkActive="active" (click)="closeMobile()">Contact</a>
            <div class="nav-actions">
              <a routerLink="/customer-login" class="btn btn-ghost btn-sm" (click)="closeMobile()">Sign In</a>
              <a routerLink="/customer-register" class="btn btn-primary btn-sm" (click)="closeMobile()">Sign Up</a>
            </div>
          </div>
        }

        <!-- Customer Nav -->
        @if (auth.isCustomerLoggedIn()) {
          <div class="nav-links" [class.open]="mobileOpen">
            <a routerLink="/customer/home" routerLinkActive="active" (click)="closeMobile()">Menu</a>
            <a routerLink="/customer/cart" routerLinkActive="active" (click)="closeMobile()">
              <span class="material-icons nav-icon">shopping_cart</span> Cart
            </a>
            <a routerLink="/customer/order" routerLinkActive="active" (click)="closeMobile()">Orders</a>
            <a routerLink="/customer/wishlist" routerLinkActive="active" (click)="closeMobile()">
              <span class="material-icons nav-icon">favorite</span>
              @if (wishlist.count() > 0) {
                <span class="nav-badge">{{ wishlist.count() }}</span>
              }
            </a>
            <div class="nav-actions">
              <span class="nav-greeting">Hi, {{ auth.customerName() }}</span>
              <button class="btn btn-ghost btn-sm" (click)="auth.customerLogout(); closeMobile()">Logout</button>
            </div>
          </div>
        }

        <!-- Admin Nav -->
        @if (auth.isAdminLoggedIn()) {
          <div class="nav-links" [class.open]="mobileOpen">
            <a routerLink="/admin/home" routerLinkActive="active" (click)="closeMobile()">Dashboard</a>
            <a routerLink="/admin/addproduct" routerLinkActive="active" (click)="closeMobile()">Add Food</a>
            <a routerLink="/admin/listproduct" routerLinkActive="active" (click)="closeMobile()">Food List</a>
            <a routerLink="/admin/order-list" routerLinkActive="active" (click)="closeMobile()">Orders</a>
            <div class="nav-actions">
              <span class="nav-greeting">{{ auth.adminName() }}</span>
              <button class="btn btn-ghost btn-sm" (click)="auth.adminLogout(); closeMobile()">Logout</button>
            </div>
          </div>
        }

        <!-- Theme Toggle + Hamburger -->
        <div class="nav-end">
          <button class="btn-icon theme-toggle" (click)="theme.toggle()" aria-label="Toggle theme">
            <span class="material-icons">{{ theme.isDark() ? 'light_mode' : 'dark_mode' }}</span>
          </button>
          <button class="hamburger" (click)="mobileOpen = !mobileOpen" aria-label="Toggle menu">
            <span class="material-icons">{{ mobileOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height);
      z-index: var(--z-sticky);
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
      transition: all var(--transition-base);
    }
    .navbar.scrolled {
      box-shadow: var(--shadow-md);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }
    .nav-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-xl);
      color: var(--text-primary);
      z-index: 10;
    }
    .logo-icon { font-size: 28px; }
    .logo-accent { color: var(--primary); }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-secondary);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      position: relative;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--primary);
      background: rgba(255, 107, 53, 0.08);
    }
    .nav-icon { font-size: 18px; }
    .nav-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background: var(--primary);
      color: white;
      font-size: 10px;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 16px;
      padding-left: 16px;
      border-left: 1px solid var(--border-light);
    }
    .nav-greeting {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
    }
    .nav-end {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .theme-toggle {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      border: none;
      cursor: pointer;
    }
    .theme-toggle:hover {
      color: var(--primary);
      background: rgba(255, 107, 53, 0.1);
    }
    .hamburger {
      display: none;
      width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
      color: var(--text-primary);
      cursor: pointer;
    }

    @media (max-width: 768px) {
      .hamburger { display: flex; }
      .nav-links {
        position: fixed;
        top: var(--navbar-height);
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        align-items: stretch;
        background: var(--bg-primary);
        padding: var(--space-lg);
        gap: 4px;
        transform: translateX(100%);
        transition: transform var(--transition-base);
      }
      .nav-links.open {
        transform: translateX(0);
      }
      .nav-links a {
        padding: 14px 16px;
        font-size: var(--text-base);
        border-radius: var(--radius-md);
      }
      .nav-actions {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
        flex-direction: column;
        margin-top: var(--space-lg);
        padding-top: var(--space-lg);
        border-top: 1px solid var(--border-light);
      }
      .nav-actions .btn { width: 100%; justify-content: center; }
    }
  `],
  host: {
    '(window:scroll)': 'onScroll()'
  }
})
export class NavbarComponent {
  scrolled = false;
  mobileOpen = false;

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    public wishlist: WishlistService,
    private router: Router
  ) {}

  onScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  closeMobile(): void {
    this.mobileOpen = false;
  }
}
