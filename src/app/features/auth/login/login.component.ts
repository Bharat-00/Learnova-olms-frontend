import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-form-wrap">
      <div class="auth-form-header">
        <h1>Welcome back</h1>
        <p>Sign in to continue your learning journey</p>
      </div>

      <div class="alert alert-danger" *ngIf="errorMsg">
        <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" formControlName="email" class="form-control"
                 [class.is-invalid]="f['email'].invalid && f['email'].touched"
                 placeholder="you@example.com">
          <div class="invalid-feedback" *ngIf="f['email'].invalid && f['email'].touched">
            <span *ngIf="f['email'].errors?.['required']">Email is required.</span>
            <span *ngIf="f['email'].errors?.['email']">Enter a valid email.</span>
          </div>
        </div>

        <div class="form-group">
          <div class="label-row">
            <label class="form-label">Password</label>
            <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>
          <div class="input-with-icon">
            <input [type]="showPassword ? 'text' : 'password'"
                   formControlName="password" class="form-control"
                   [class.is-invalid]="f['password'].invalid && f['password'].touched"
                   placeholder="Enter your password">
            <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
              <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
            </button>
          </div>
          <div class="invalid-feedback" *ngIf="f['password'].invalid && f['password'].touched">
            Password is required.
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
          <span *ngIf="loading" class="spinner-sm"></span>
          <span *ngIf="!loading"><i class="fas fa-sign-in-alt"></i> Sign In</span>
          <span *ngIf="loading">Signing in...</span>
        </button>
      </form>

      <div class="auth-divider"><span>or continue with</span></div>

      <div class="demo-accounts">
        <p class="demo-label">Quick demo login:</p>
        <div class="demo-btns">
          <button class="demo-btn" (click)="demoLogin('student')">
            <i class="fas fa-user-graduate"></i> Student
          </button>
          <button class="demo-btn" (click)="demoLogin('instructor')">
            <i class="fas fa-chalkboard-teacher"></i> Instructor
          </button>
          <button class="demo-btn" (click)="demoLogin('admin')">
            <i class="fas fa-user-shield"></i> Admin
          </button>
        </div>
      </div>

      <p class="auth-switch">
        Don't have an account? <a routerLink="/register">Create one free</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-form-wrap {
      width: 100%; max-width: 440px;
      background: var(--white);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl);
      padding: 40px;
      box-shadow: var(--shadow);
    }
    .auth-form-header { margin-bottom: 28px; }
    .auth-form-header h1 {
      font-size: 1.6rem; font-weight: 700; color: var(--gray-900);
    }
    .auth-form-header p { color: var(--gray-500); font-size: 0.95rem; margin-top: 4px; }
    .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .forgot-link { font-size: 0.825rem; color: var(--primary); }
    .input-with-icon { position: relative; }
    .input-with-icon .form-control { padding-right: 42px; }
    .toggle-pass {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      border: none; background: none; cursor: pointer;
      color: var(--gray-400); font-size: 0.875rem;
    }
    .btn-block { width: 100%; justify-content: center; padding: 12px; font-size: 0.95rem; }
    .spinner-sm {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    .auth-divider {
      text-align: center; margin: 24px 0; position: relative;
      color: var(--gray-400); font-size: 0.8rem;
    }
    .auth-divider::before, .auth-divider::after {
      content: ''; position: absolute; top: 50%;
      width: calc(50% - 60px); height: 1px; background: var(--gray-200);
    }
    .auth-divider::before { left: 0; }
    .auth-divider::after { right: 0; }
    .demo-label { font-size: 0.8rem; color: var(--gray-500); margin-bottom: 8px; text-align: center; }
    .demo-btns { display: flex; gap: 8px; }
    .demo-btn {
      flex: 1; padding: 8px 10px; border: 1.5px solid var(--gray-200);
      border-radius: var(--radius); background: var(--white);
      font-size: 0.78rem; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 6px;
      color: var(--gray-600); transition: var(--transition);
    }
    .demo-btn:hover { border-color: var(--primary); color: var(--primary); background: var(--primary-light); }
    .auth-switch {
      text-align: center; margin-top: 20px;
      font-size: 0.875rem; color: var(--gray-500);
    }
    .auth-switch a { color: var(--primary); font-weight: 600; }
  `]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';
  showPassword = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getDashboardRoute()]);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.form.value).subscribe({
      next: () => {
        const dest = this.returnUrl || this.authService.getDashboardRoute();
        this.router.navigateByUrl(dest);
      },
      error: err => {
        this.errorMsg = err.userMessage || err.error?.message || 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }

  demoLogin(role: 'student' | 'instructor' | 'admin') {
    const accounts = {
      student:    { email: 'student@learnova.com',    password: 'password123' },
      instructor: { email: 'instructor@learnova.com', password: 'password123' },
      admin:      { email: 'admin@learnova.com',      password: 'password123' }
    };
    this.form.setValue(accounts[role]);
    this.onSubmit();
  }
}
