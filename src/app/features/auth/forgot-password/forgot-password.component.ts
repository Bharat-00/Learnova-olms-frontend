import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-form-wrap">
      <div class="auth-form-header">
        <div class="back-icon"><i class="fas fa-lock"></i></div>
        <h1>Reset your password</h1>
        <p>Enter your email and we'll send you a reset link.</p>
      </div>

      <div class="alert alert-success" *ngIf="sent">
        <i class="fas fa-check-circle"></i>
        A password reset link has been sent to <strong>{{ form.value.email }}</strong>. Check your inbox.
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" *ngIf="!sent">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" formControlName="email" class="form-control"
                 [class.is-invalid]="f['email'].invalid && f['email'].touched"
                 placeholder="you@example.com">
          <div class="invalid-feedback" *ngIf="f['email'].invalid && f['email'].touched">
            Enter a valid email address.
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
          <span *ngIf="loading" class="spinner-sm"></span>
          <span *ngIf="!loading"><i class="fas fa-paper-plane"></i> Send Reset Link</span>
          <span *ngIf="loading">Sending...</span>
        </button>
      </form>

      <p class="auth-switch">
        <a routerLink="/login"><i class="fas fa-arrow-left"></i> Back to Sign In</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-form-wrap {
      width: 100%; max-width: 420px;
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow);
    }
    .back-icon {
      width: 52px; height: 52px; border-radius: var(--radius-lg);
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; margin-bottom: 16px;
    }
    .auth-form-header h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 6px; }
    .auth-form-header p { color: var(--gray-500); font-size: 0.9rem; margin-bottom: 24px; }
    .btn-block { width: 100%; justify-content: center; padding: 12px; }
    .spinner-sm {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    .auth-switch { text-align: center; margin-top: 20px; font-size: 0.875rem; }
    .auth-switch a { color: var(--primary); font-weight: 500; }
  `]
})
export class ForgotPasswordComponent {
  form: FormGroup;
  loading = false;
  sent = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    // Simulate API call — backend endpoint would be /api/auth/forgot-password
    setTimeout(() => { this.loading = false; this.sent = true; }, 1200);
  }
}
