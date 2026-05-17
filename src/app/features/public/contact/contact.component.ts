import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="contact-page">
      <div class="contact-hero">
        <h1>Get In Touch</h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div class="contact-container">
        <div class="contact-info">
          <div class="info-item" *ngFor="let info of contactInfo">
            <div class="info-icon"><i class="fas {{ info.icon }}"></i></div>
            <div>
              <div class="info-label">{{ info.label }}</div>
              <div class="info-value">{{ info.value }}</div>
            </div>
          </div>

          <div class="faq-section">
            <h3>Frequently Asked</h3>
            <div class="faq-item" *ngFor="let faq of faqs">
              <div class="faq-q" (click)="faq.open = !faq.open">
                <span>{{ faq.q }}</span>
                <i class="fas" [class.fa-chevron-down]="!faq.open" [class.fa-chevron-up]="faq.open"></i>
              </div>
              <div class="faq-a" *ngIf="faq.open">{{ faq.a }}</div>
            </div>
          </div>
        </div>

        <div class="contact-form-card card">
          <h2>Send Us a Message</h2>
          <div class="alert alert-success" *ngIf="sent">
            <i class="fas fa-check-circle"></i> Your message has been sent! We'll reply within 24 hours.
          </div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!sent">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input type="text" formControlName="name" class="form-control"
                       [class.is-invalid]="f['name'].invalid && f['name'].touched" placeholder="Your name">
                <div class="invalid-feedback" *ngIf="f['name'].invalid && f['name'].touched">Name is required.</div>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" formControlName="email" class="form-control"
                       [class.is-invalid]="f['email'].invalid && f['email'].touched" placeholder="you@example.com">
                <div class="invalid-feedback" *ngIf="f['email'].invalid && f['email'].touched">Valid email required.</div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Subject</label>
              <select class="form-control form-select" formControlName="subject">
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Payments</option>
                <option value="instructor">Becoming an Instructor</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Message</label>
              <textarea formControlName="message" class="form-control"
                        [class.is-invalid]="f['message'].invalid && f['message'].touched"
                        rows="5" placeholder="Tell us how we can help..."></textarea>
              <div class="invalid-feedback" *ngIf="f['message'].invalid && f['message'].touched">Message is required.</div>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="loading" class="spinner-sm"></span>
              <span *ngIf="!loading"><i class="fas fa-paper-plane"></i> Send Message</span>
              <span *ngIf="loading">Sending...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-hero { background: linear-gradient(135deg, var(--primary-subtle), var(--white));
      padding: 60px 0; text-align: center; border-bottom: 1px solid var(--gray-200); }
    .contact-hero h1 { font-size: 2.2rem; font-weight: 700; margin-bottom: 10px; }
    .contact-hero p { color: var(--gray-500); max-width: 480px; margin: 0 auto; }
    .contact-container {
      max-width: 1100px; margin: 0 auto; padding: 48px 24px;
      display: grid; grid-template-columns: 360px 1fr; gap: 40px;
    }
    .info-item { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 24px; }
    .info-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; flex-shrink: 0;
    }
    .info-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-400); margin-bottom: 2px; }
    .info-value { font-size: 0.9rem; color: var(--gray-700); font-weight: 500; }
    .faq-section { margin-top: 32px; }
    .faq-section h3 { font-size: 1rem; font-weight: 700; margin-bottom: 16px; color: var(--gray-700); }
    .faq-item { border: 1px solid var(--gray-200); border-radius: var(--radius); margin-bottom: 8px; overflow: hidden; }
    .faq-q {
      padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;
      font-size: 0.875rem; font-weight: 500; cursor: pointer;
      background: var(--white); color: var(--gray-700);
    }
    .faq-q:hover { background: var(--gray-50); }
    .faq-q i { font-size: 0.75rem; color: var(--gray-400); }
    .faq-a { padding: 10px 16px 14px; font-size: 0.85rem; color: var(--gray-500); line-height: 1.6; background: var(--gray-50); }
    .contact-form-card h2 { font-size: 1.3rem; font-weight: 700; margin-bottom: 24px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    @media (max-width: 800px) {
      .contact-container { grid-template-columns: 1fr; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  form: FormGroup;
  loading = false;
  sent = false;

  contactInfo = [
    { icon: 'fa-envelope', label: 'Email', value: 'support@learnova.com' },
    { icon: 'fa-phone', label: 'Phone', value: '+1 (800) LEARNOVA' },
    { icon: 'fa-map-marker-alt', label: 'Address', value: '123 Learning Street, EdTech City' },
    { icon: 'fa-clock', label: 'Support Hours', value: 'Mon–Fri, 9am–6pm EST' }
  ];

  faqs = [
    { q: 'How do I enroll in a course?', a: 'Simply browse our catalog, click a course, and hit "Enroll Now". Free courses enroll instantly; paid courses go through checkout.', open: false },
    { q: 'Can I get a refund?', a: 'We offer a 30-day money-back guarantee on all paid courses if you are unsatisfied with the content.', open: false },
    { q: 'How do I become an instructor?', a: 'Register with the "Instructor" role and start creating courses from your instructor dashboard.', open: false }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name:    ['', Validators.required],
      email:   ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    setTimeout(() => { this.loading = false; this.sent = true; }, 1200);
  }
}
