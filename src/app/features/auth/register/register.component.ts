import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="auth-form-wrap">
      <div class="auth-form-header">
        <h1>Create your account</h1>
        <p>Join Learnova and start learning today</p>
      </div>

      <div class="alert alert-danger" *ngIf="errorMsg">
        <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
      </div>
      <div class="alert alert-success" *ngIf="successMsg">
        <i class="fas fa-check-circle"></i> {{ successMsg }}
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="name-row">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" formControlName="firstName" class="form-control"
                   [class.is-invalid]="f['firstName'].invalid && f['firstName'].touched"
                   placeholder="John">
            <div class="invalid-feedback" *ngIf="f['firstName'].invalid && f['firstName'].touched">
              First name is required.
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" formControlName="lastName" class="form-control"
                   [class.is-invalid]="f['lastName'].invalid && f['lastName'].touched"
                   placeholder="Doe">
            <div class="invalid-feedback" *ngIf="f['lastName'].invalid && f['lastName'].touched">
              Last name is required.
            </div>
          </div>
        </div>

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
          <label class="form-label">I want to join as</label>
          <div class="role-options">
            <label class="role-option" [class.selected]="f['role'].value === 'STUDENT'">
              <input type="radio" formControlName="role" value="STUDENT">
              <div class="role-icon"><i class="fas fa-user-graduate"></i></div>
              <div>
                <div class="role-name">Student</div>
                <div class="role-desc">Learn from experts</div>
              </div>
            </label>
            <label class="role-option" [class.selected]="f['role'].value === 'INSTRUCTOR'">
              <input type="radio" formControlName="role" value="INSTRUCTOR">
              <div class="role-icon"><i class="fas fa-chalkboard-teacher"></i></div>
              <div>
                <div class="role-name">Instructor</div>
                <div class="role-desc">Teach & earn</div>
              </div>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-with-icon">
            <input [type]="showPassword ? 'text' : 'password'"
                   formControlName="password" class="form-control"
                   [class.is-invalid]="f['password'].invalid && f['password'].touched"
                   placeholder="At least 8 characters">
            <button type="button" class="toggle-pass" (click)="showPassword = !showPassword">
              <i class="fas" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
            </button>
          </div>
          <div class="invalid-feedback" *ngIf="f['password'].invalid && f['password'].touched">
            <span *ngIf="f['password'].errors?.['required']">Password is required.</span>
            <span *ngIf="f['password'].errors?.['minlength']">Must be at least 8 characters.</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input type="password" formControlName="confirmPassword" class="form-control"
                 [class.is-invalid]="f['confirmPassword'].touched && form.errors?.['mismatch']"
                 placeholder="Re-enter your password">
          <div class="invalid-feedback" *ngIf="f['confirmPassword'].touched && form.errors?.['mismatch']">
            Passwords do not match.
          </div>
        </div>

        <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
          <span *ngIf="loading" class="spinner-sm"></span>
          <span *ngIf="!loading"><i class="fas fa-user-plus"></i> Create Account</span>
          <span *ngIf="loading">Creating account...</span>
        </button>
      </form>

      <p class="auth-switch">
        Already have an account? <a routerLink="/login">Sign in</a>
      </p>
    </div>
  `,
  styles: [`
    .auth-form-wrap {
      width: 100%; max-width: 480px;
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-xl); padding: 40px; box-shadow: var(--shadow);
    }
    .auth-form-header { margin-bottom: 28px; }
    .auth-form-header h1 { font-size: 1.5rem; font-weight: 700; }
    .auth-form-header p { color: var(--gray-500); margin-top: 4px; }
    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .role-options { display: flex; gap: 12px; }
    .role-option {
      flex: 1; display: flex; align-items: center; gap: 10px;
      padding: 12px 14px; border: 1.5px solid var(--gray-200);
      border-radius: var(--radius); cursor: pointer; transition: var(--transition);
    }
    .role-option input { display: none; }
    .role-option.selected { border-color: var(--primary); background: var(--primary-light); }
    .role-icon {
      width: 36px; height: 36px; border-radius: var(--radius);
      background: var(--gray-100); display: flex; align-items: center; justify-content: center;
      color: var(--gray-500); flex-shrink: 0;
    }
    .role-option.selected .role-icon { background: var(--primary); color: #fff; }
    .role-name { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .role-desc { font-size: 0.75rem; color: var(--gray-500); }
    .input-with-icon { position: relative; }
    .input-with-icon .form-control { padding-right: 42px; }
    .toggle-pass {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      border: none; background: none; cursor: pointer; color: var(--gray-400);
    }
    .btn-block { width: 100%; justify-content: center; padding: 12px; }
    .spinner-sm {
      display: inline-block; width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    .auth-switch { text-align: center; margin-top: 20px; font-size: 0.875rem; color: var(--gray-500); }
    .auth-switch a { color: var(--primary); font-weight: 600; }
    @media (max-width: 480px) {
      .name-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';
  successMsg = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getDashboardRoute()]);
      return;
    }
    this.form = this.fb.group({
      firstName:       ['', Validators.required],
      lastName:        ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      role:            ['STUDENT'],
      password:        ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  get f() { return this.form.controls; }

  passwordMatchValidator(g: FormGroup) {
    const pass = g.get('password')?.value;
    const confirm = g.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.errorMsg = '';
    const { confirmPassword, ...payload } = this.form.value;
    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate([this.authService.getDashboardRoute()]);
      },
      error: err => {
        this.errorMsg = err.userMessage || err.error?.message || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
