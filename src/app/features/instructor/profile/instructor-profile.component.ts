import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-instructor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Profile Settings</h1><p class="page-subtitle">Manage your instructor account</p></div></div>
      <div class="profile-layout">
        <div class="card avatar-card">
          <div class="avatar avatar-xl mx-auto">{{ initials }}</div>
          <div class="profile-name">{{ user?.firstName }} {{ user?.lastName }}</div>
          <div class="profile-email">{{ user?.email }}</div>
          <div class="profile-role badge badge-primary">{{ user?.role }}</div>
        </div>
        <div class="profile-forms">
          <div class="card">
            <h3 class="form-section-title">Personal Information</h3>
            <div class="alert alert-success" *ngIf="profileSuccess"><i class="fas fa-check-circle"></i> Profile updated!</div>
            <div class="alert alert-danger"  *ngIf="profileError"><i class="fas fa-exclamation-circle"></i> {{ profileError }}</div>
            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
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
                <input type="tel" formControlName="phone" class="form-control" placeholder="+1 234 567 8900">
              </div>
              <div class="form-group">
                <label class="form-label">Instructor Bio</label>
                <textarea formControlName="bio" class="form-control" rows="4" placeholder="Tell students about yourself, your expertise, and teaching philosophy..."></textarea>
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
    </div>
  `,
  styles: [`
    .profile-layout { display:grid;grid-template-columns:240px 1fr;gap:24px;align-items:start; }
    .avatar-card { text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;position:sticky;top:80px; }
    .mx-auto { margin:0 auto; }
    .profile-name { font-weight:700;font-size:1rem; }
    .profile-email { font-size:0.82rem;color:var(--gray-500); }
    .profile-role { display:inline-flex; }
    .form-section-title { font-size:1rem;font-weight:700;margin-bottom:20px;padding-bottom:12px;border-bottom:1px solid var(--gray-100); }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:16px; }
    .spinner-sm { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:spin 0.6s linear infinite; }
    @media (max-width:768px) { .profile-layout { grid-template-columns:1fr; } .avatar-card { position:static; } .form-row { grid-template-columns:1fr; } }
  `]
})
export class InstructorProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  saving = false;
  profileSuccess = false;
  profileError = '';

  constructor(private authService: AuthService, private userService: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName || '', Validators.required],
      lastName:  [this.user?.lastName  || '', Validators.required],
      email:     [{ value: this.user?.email || '', disabled: true }],
      phone:     [this.user?.phone || ''],
      bio:       [this.user?.bio || '']
    });
  }

  get initials() { return this.user ? `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase() : ''; }

  saveProfile() {
    if (this.profileForm.invalid || !this.user) return;
    this.saving = true;
    this.userService.updateProfile(this.user.id, this.profileForm.value).subscribe({
      next: () => { this.saving = false; this.profileSuccess = true; setTimeout(() => this.profileSuccess = false, 3000); },
      error: err => { this.saving = false; this.profileError = err.userMessage || 'Update failed.'; }
    });
  }
}
