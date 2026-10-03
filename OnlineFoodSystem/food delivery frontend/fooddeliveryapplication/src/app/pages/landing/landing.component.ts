import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService } from '../../core/services/food.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="landing">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-content">
          <div class="hero-text animate-fade-in-up">
            <span class="hero-tag">🔥 #1 Food Delivery Platform</span>
            <h1 class="heading-display heading-1">Delicious Food,<br><span class="text-gradient">Delivered Fast</span></h1>
            <p class="hero-desc">Order from your favorite restaurants. Fresh ingredients, expert chefs, and lightning-fast delivery right to your doorstep.</p>
            <div class="hero-actions">
              <button class="btn btn-primary btn-lg" (click)="goTo('/customer-login')">
                <span class="material-icons">restaurant_menu</span> Order Now
              </button>
              <button class="btn btn-secondary btn-lg" (click)="goTo('/about-us')">Learn More</button>
            </div>
            <div class="hero-stats">
              <div class="stat"><span class="stat-num">500+</span><span class="stat-label">Menu Items</span></div>
              <div class="stat"><span class="stat-num">10k+</span><span class="stat-label">Happy Customers</span></div>
              <div class="stat"><span class="stat-num">30min</span><span class="stat-label">Avg Delivery</span></div>
            </div>
          </div>
          <div class="hero-visual animate-scale-in">
            <div class="hero-image-wrapper">
              <div class="hero-glow"></div>
              <div class="hero-plate">🍕</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">Browse Categories</span>
            <h2 class="heading-display heading-2">Explore Our Menu</h2>
            <p class="section-desc">From appetizers to desserts, we have everything you crave</p>
          </div>
          <div class="category-grid stagger-children">
            @for (cat of foodService.categories; track cat.value) {
              <div class="category-card card" (click)="goTo('/customer-login')">
                <div class="category-emoji">{{ cat.icon }}</div>
                <h3 class="category-name">{{ cat.name }}</h3>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="section-tag">Why Choose Us</span>
            <h2 class="heading-display heading-2">A Better Way to Order</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card card card-body">
              <div class="feature-icon-wrap"><span class="material-icons">speed</span></div>
              <h3>Lightning Fast</h3>
              <p>Average delivery in under 30 minutes. Hot food, every time.</p>
            </div>
            <div class="feature-card card card-body">
              <div class="feature-icon-wrap"><span class="material-icons">restaurant</span></div>
              <h3>Fresh Quality</h3>
              <p>Prepared with the freshest ingredients by expert chefs.</p>
            </div>
            <div class="feature-card card card-body">
              <div class="feature-icon-wrap"><span class="material-icons">local_offer</span></div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with exclusive deals and offers.</p>
            </div>
            <div class="feature-card card card-body">
              <div class="feature-icon-wrap"><span class="material-icons">support_agent</span></div>
              <h3>24/7 Support</h3>
              <p>Our support team is always ready to help you.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-card card-glass">
            <h2 class="heading-display heading-3">Ready to Order?</h2>
            <p>Join thousands of happy customers. Sign up now and get your first delivery!</p>
            <button class="btn btn-primary btn-lg" (click)="goTo('/customer-register')">
              <span class="material-icons">person_add</span> Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 90vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding-top: var(--navbar-height);
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 70% 50%, rgba(255,107,53,0.08) 0%, transparent 60%),
                  radial-gradient(ellipse at 30% 80%, rgba(247,201,72,0.06) 0%, transparent 50%);
    }
    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3xl);
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .hero-tag {
      display: inline-block;
      padding: 8px 18px;
      background: var(--primary-glow);
      color: var(--primary);
      font-size: var(--text-sm);
      font-weight: 600;
      border-radius: var(--radius-full);
      margin-bottom: var(--space-lg);
    }
    .hero-text h1 { margin-bottom: var(--space-lg); color: var(--text-primary); }
    .text-gradient {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-desc {
      font-size: var(--text-lg);
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 500px;
      margin-bottom: var(--space-xl);
    }
    .hero-actions { display: flex; gap: var(--space-md); margin-bottom: var(--space-2xl); }
    .hero-stats { display: flex; gap: var(--space-2xl); }
    .stat { display: flex; flex-direction: column; }
    .stat-num {
      font-family: var(--font-display);
      font-size: var(--text-2xl);
      font-weight: 800;
      color: var(--text-primary);
    }
    .stat-label { font-size: var(--text-xs); color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em; }

    .hero-visual { display: flex; justify-content: center; align-items: center; }
    .hero-image-wrapper { position: relative; }
    .hero-glow {
      position: absolute;
      width: 350px;
      height: 350px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: pulse 3s ease infinite;
    }
    .hero-plate {
      font-size: 220px;
      position: relative;
      z-index: 1;
      animation: float 4s ease-in-out infinite;
      filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }

    /* Categories */
    .categories-section, .features-section { padding: var(--space-4xl) 0; }
    .section-header { margin-bottom: var(--space-2xl); }
    .section-tag {
      display: inline-block;
      padding: 6px 16px;
      background: var(--primary-glow);
      color: var(--primary);
      font-size: var(--text-xs);
      font-weight: 700;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: var(--space-md);
    }
    .section-desc { color: var(--text-secondary); font-size: var(--text-lg); margin-top: var(--space-sm); }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
    }
    .category-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-xl) var(--space-lg);
      cursor: pointer;
      text-align: center;
    }
    .category-emoji {
      font-size: 48px;
      margin-bottom: var(--space-md);
      transition: transform var(--transition-spring);
    }
    .category-card:hover .category-emoji { transform: scale(1.2) rotate(-5deg); }
    .category-name { font-weight: 600; font-size: var(--text-base); color: var(--text-primary); }

    /* Features */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
    }
    .feature-card { text-align: center; }
    .feature-icon-wrap {
      width: 64px;
      height: 64px;
      margin: 0 auto var(--space-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-radius: var(--radius-lg);
      color: white;
    }
    .feature-icon-wrap .material-icons { font-size: 28px; }
    .feature-card h3 { font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary); }
    .feature-card p { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6; }

    /* CTA */
    .cta-section { padding-bottom: var(--space-3xl); }
    .cta-card {
      text-align: center;
      padding: var(--space-3xl);
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
    }
    .cta-card h2 { color: white; margin-bottom: var(--space-md); }
    .cta-card p { color: rgba(255,255,255,0.85); font-size: var(--text-lg); margin-bottom: var(--space-xl); }
    .cta-card .btn { background: white; color: var(--primary); box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
    .cta-card .btn:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }

    @media (max-width: 768px) {
      .hero-content { grid-template-columns: 1fr; text-align: center; }
      .hero-desc { margin: 0 auto var(--space-xl); }
      .hero-actions { justify-content: center; }
      .hero-stats { justify-content: center; }
      .hero-visual { display: none; }
      .category-grid { grid-template-columns: repeat(2, 1fr); }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
      .category-grid, .features-grid { grid-template-columns: 1fr; }
      .hero-actions { flex-direction: column; align-items: center; }
      .hero-stats { flex-direction: column; align-items: center; gap: var(--space-md); }
    }
  `]
})
export class LandingComponent {
  constructor(public foodService: FoodService, private router: Router) {}

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
