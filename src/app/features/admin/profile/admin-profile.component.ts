import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Profile Settings</h1><p class="page-subtitle">Manage your admin account</p></div></div>
      <div class="profile-layout">
        <div class="card avatar-card">
          <div class="avatar avatar-xl mx-auto">{{ initials }}</div>
          <div class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</div>
          <div class="profile-email">{{ user?.email }}</div>
          <div class="profile-role badge badge-danger">ADMIN</div>
        </div>
        <div class="card">
          <h3 class="form-section-title">Account Information</h3>
          <div class="alert alert-success" *ngIf="success"><i class="fas fa-check-circle"></i> Profile updated successfully!</div>
          <div class="alert alert-danger"  *ngIf="error"><i class="fas fa-exclamation-circle"></i> {{ error }}</div>
          <form [formGroup]="form" (ngSubmit)="save()">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" formControlName="firstName" class="form-control">
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" formControlName="lastName" class="form-control">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" formControlName="email" class="form-control" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" formControlName="phone" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="saving" class="spinner-sm"></span>
              <i *ngIf="!saving" class="fas fa-save"></i>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout { display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:start; }
    .avatar-card { text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px; }
    .mx-auto { margin:0 auto; }
    .profile-name { font-weight:700;font-size:1rem; }
    .profile-email { font-size:0.82rem;color:var(--gray-500); }
    .profile-role { display:inline-flex; }
    .badge-danger { background:var(--danger-light);color:var(--danger); }
    .form-section-title { font-size:1rem;font-weight:700;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--gray-100); }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
    .spinner-sm { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite; }
    @media (max-width:768px) { .profile-layout { grid-template-columns:1fr; } .form-row { grid-template-columns:1fr; } }
  `]
})
export class AdminProfileComponent implements OnInit {
  user: User | null = null;
  form!: FormGroup;
  saving = false;
  success = false;
  error = '';

  constructor(private authService: AuthService, private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.form = this.fb.group({
      firstName: [this.user?.firstName || '', Validators.required],
      lastName:  [this.user?.lastName  || '', Validators.required],
      email:     [{ value: this.user?.email || '', disabled: true }],
      phone:     [this.user?.phone || '']
    });
  }

  get initials() { return this.user ? `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase() : ''; }

  save() {
    if (this.form.invalid || !this.user) return;
    this.saving = true;
    this.userService.updateProfile(this.user.id, this.form.value).subscribe({
      next: () => { this.saving = false; this.success = true; setTimeout(() => this.success = false, 3000); },
      error: err => { this.saving = false; this.error = err.userMessage || 'Update failed.'; }
    });
  }
}
