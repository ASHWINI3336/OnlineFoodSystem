import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page-content">
      <div class="container">
        <section class="contact-hero animate-fade-in-up">
          <span class="section-tag">Contact Us</span>
          <h1 class="heading-display heading-2">Get In Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </section>
        <div class="contact-grid">
          <div class="contact-form card card-glass animate-fade-in-up">
            <form (ngSubmit)="send()">
              <div class="form-group">
                <label class="form-label">Your Name</label>
                <input type="text" class="form-input" [(ngModel)]="name" name="name" placeholder="John Doe" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" [(ngModel)]="email" name="email" placeholder="you@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-input textarea" [(ngModel)]="message" name="message" placeholder="Your message..." rows="5" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg w-full">Send Message</button>
            </form>
          </div>
          <div class="contact-info animate-fade-in-up">
            <div class="info-card card card-body">
              <span class="material-icons info-icon">location_on</span>
              <h4>Address</h4>
              <p>#401, Kushwah Chambers, 702 Makwana Rd, Marol Andheri (E), Mumbai-59</p>
            </div>
            <div class="info-card card card-body">
              <span class="material-icons info-icon">email</span>
              <h4>Email</h4>
              <p>hello&#64;foodiehub.com</p>
            </div>
            <div class="info-card card card-body">
              <span class="material-icons info-icon">phone</span>
              <h4>Phone</h4>
              <p>+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-hero { text-align:center;padding:var(--space-4xl) 0 var(--space-2xl);max-width:600px;margin:0 auto; }
    .section-tag { display:inline-block;padding:6px 16px;background:var(--primary-glow);color:var(--primary);font-size:var(--text-xs);font-weight:700;border-radius:var(--radius-full);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:var(--space-md); }
    .contact-hero h1 { color:var(--text-primary);margin-bottom:var(--space-md); }
    .contact-hero p { color:var(--text-secondary);font-size:var(--text-lg); }
    .contact-grid { display:grid;grid-template-columns:1.2fr 1fr;gap:var(--space-xl);padding-bottom:var(--space-3xl); }
    .contact-form { padding:var(--space-xl);border-radius:var(--radius-xl); }
    .textarea { resize:vertical;min-height:120px; }
    .contact-info { display:flex;flex-direction:column;gap:var(--space-md); }
    .info-card { display:flex;align-items:flex-start;gap:var(--space-md); }
    .info-icon { color:var(--primary);font-size:24px;margin-top:2px; }
    .info-card h4 { font-size:var(--text-sm);font-weight:700;color:var(--text-primary);margin-bottom:4px; }
    .info-card p { font-size:var(--text-sm);color:var(--text-secondary); }
    @media (max-width:768px) { .contact-grid { grid-template-columns:1fr; } }
  `]
})
export class ContactComponent {
  name = ''; email = ''; message = '';
  constructor(private toast: ToastService) {}
  send(): void {
    this.toast.success('Message sent! We\'ll get back to you soon.');
    this.name = ''; this.email = ''; this.message = '';
  }
}
