import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-icon">🍔</span>
              <span class="logo-text">Foodie<span class="accent">Hub</span></span>
            </div>
            <p class="footer-desc">Delicious food delivered fast. Browse menus, place orders, and track delivery in real time.</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <a routerLink="/">Home</a>
            <a routerLink="/about-us">About Us</a>
            <a routerLink="/contact-us">Contact</a>
          </div>
          <div class="footer-col">
            <h4>Account</h4>
            <a routerLink="/customer-login">Customer Login</a>
            <a routerLink="/customer-register">Register</a>
            <a routerLink="/admin-login">Admin Login</a>
          </div>
          <div class="footer-col">
            <h4>Contact</h4>
            <p><span class="material-icons footer-icon">location_on</span> #401, Kushwah Chambers, Mumbai</p>
            <p><span class="material-icons footer-icon">email</span> hello&#64;foodiehub.com</p>
            <p><span class="material-icons footer-icon">phone</span> +91 98765 43210</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 FoodieHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--bg-secondary);
      border-top: 1px solid var(--border-light);
      padding: var(--space-3xl) 0 0;
      margin-top: var(--space-3xl);
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: var(--space-2xl);
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: var(--text-xl);
      margin-bottom: var(--space-md);
    }
    .logo-icon { font-size: 28px; }
    .accent { color: var(--primary); }
    .footer-desc {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 300px;
    }
    .footer-col h4 {
      font-size: var(--text-sm);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-primary);
      margin-bottom: var(--space-md);
    }
    .footer-col a, .footer-col p {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin-bottom: 12px;
      transition: color var(--transition-fast);
    }
    .footer-col a:hover { color: var(--primary); }
    .footer-icon { font-size: 16px; color: var(--primary); }
    .footer-bottom {
      border-top: 1px solid var(--border-light);
      padding: var(--space-lg) 0;
      margin-top: var(--space-2xl);
      text-align: center;
    }
    .footer-bottom p {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: var(--space-xl); }
    }
    @media (max-width: 480px) {
      .footer-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FooterComponent {}
