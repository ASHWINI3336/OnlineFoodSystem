import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="page-content">
      <div class="container">
        <section class="about-hero animate-fade-in-up">
          <span class="section-tag">About Us</span>
          <h1 class="heading-display heading-1">We Deliver <span class="text-gradient">Happiness</span></h1>
          <p class="about-desc">FoodieHub is your go-to platform for ordering delicious food from the best restaurants in town. Our mission is to make food delivery fast, reliable, and affordable for everyone.</p>
        </section>
        <div class="values-grid stagger-children">
          <div class="value-card card card-body">
            <span class="value-emoji">🎯</span>
            <h3>Our Mission</h3>
            <p>To connect food lovers with great restaurants and deliver joy to every doorstep.</p>
          </div>
          <div class="value-card card card-body">
            <span class="value-emoji">👁️</span>
            <h3>Our Vision</h3>
            <p>To become the most trusted and loved food delivery platform in the region.</p>
          </div>
          <div class="value-card card card-body">
            <span class="value-emoji">💎</span>
            <h3>Our Values</h3>
            <p>Quality food, honest pricing, exceptional service, and customer satisfaction above all.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-hero { text-align:center;padding:var(--space-4xl) 0 var(--space-2xl);max-width:700px;margin:0 auto; }
    .section-tag { display:inline-block;padding:6px 16px;background:var(--primary-glow);color:var(--primary);font-size:var(--text-xs);font-weight:700;border-radius:var(--radius-full);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-md); }
    .text-gradient { background:linear-gradient(135deg,var(--primary),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
    .about-hero h1 { color:var(--text-primary);margin-bottom:var(--space-lg); }
    .about-desc { font-size:var(--text-lg);color:var(--text-secondary);line-height:1.8; }
    .values-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-lg);padding-bottom:var(--space-3xl); }
    .value-card { text-align:center; }
    .value-emoji { font-size:48px;margin-bottom:var(--space-md);display:block; }
    .value-card h3 { font-size:var(--text-lg);font-weight:700;color:var(--text-primary);margin-bottom:var(--space-sm); }
    .value-card p { font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7; }
    @media (max-width:768px) { .values-grid { grid-template-columns:1fr; } }
  `]
})
export class AboutComponent {}
