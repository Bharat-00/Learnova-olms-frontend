import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Profile Settings</h1>
          <p class="page-subtitle">Manage your account information and preferences</p>
        </div>
      </div>

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

            <div class="alert alert-success" *ngIf="profileSuccess">
              <i class="fas fa-check-circle"></i> Profile updated successfully!
            </div>
            <div class="alert alert-danger" *ngIf="profileError">
              <i class="fas fa-exclamation-circle"></i> {{ profileError }}
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" formControlName="firstName" class="form-control"
                         [class.is-invalid]="pf['firstName'].invalid && pf['firstName'].touched">
                  <div class="invalid-feedback" *ngIf="pf['firstName'].invalid && pf['firstName'].touched">Required.</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" formControlName="lastName" class="form-control"
                         [class.is-invalid]="pf['lastName'].invalid && pf['lastName'].touched">
                  <div class="invalid-feedback" *ngIf="pf['lastName'].invalid && pf['lastName'].touched">Required.</div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" formControlName="email" class="form-control" readonly>
                <small class="text-muted">Email cannot be changed.</small>
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input type="tel" formControlName="phone" class="form-control" placeholder="+1 234 567 8900">
              </div>
              <div class="form-group">
                <label class="form-label">Bio</label>
                <textarea formControlName="bio" class="form-control" rows="4"
                          placeholder="Tell us a bit about yourself..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="savingProfile">
                <span *ngIf="savingProfile" class="spinner-sm"></span>
                <i *ngIf="!savingProfile" class="fas fa-save"></i>
                {{ savingProfile ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>

          <div class="card">
            <h3 class="form-section-title">Change Password</h3>

            <div class="alert alert-success" *ngIf="passSuccess">
              <i class="fas fa-check-circle"></i> Password changed successfully!
            </div>
            <div class="alert alert-danger" *ngIf="passError">
              <i class="fas fa-exclamation-circle"></i> {{ passError }}
            </div>

            <form [formGroup]="passForm" (ngSubmit)="changePassword()">
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" formControlName="currentPassword" class="form-control"
                       [class.is-invalid]="passf['currentPassword'].invalid && passf['currentPassword'].touched">
                <div class="invalid-feedback" *ngIf="passf['currentPassword'].invalid && passf['currentPassword'].touched">Required.</div>
              </div>
              <div class="form-group">
                <label class="form-label">New Password</label>
                <input type="password" formControlName="newPassword" class="form-control"
                       [class.is-invalid]="passf['newPassword'].invalid && passf['newPassword'].touched"
                       placeholder="At least 8 characters">
                <div class="invalid-feedback" *ngIf="passf['newPassword'].invalid && passf['newPassword'].touched">
                  <span *ngIf="passf['newPassword'].errors?.['minlength']">Minimum 8 characters.</span>
                  <span *ngIf="passf['newPassword'].errors?.['required']">Required.</span>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" formControlName="confirmPassword" class="form-control"
                       [class.is-invalid]="passf['confirmPassword'].touched && passForm.errors?.['mismatch']">
                <div class="invalid-feedback" *ngIf="passf['confirmPassword'].touched && passForm.errors?.['mismatch']">
                  Passwords do not match.
                </div>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="savingPass">
                <span *ngIf="savingPass" class="spinner-sm"></span>
                <i *ngIf="!savingPass" class="fas fa-key"></i>
                {{ savingPass ? 'Changing...' : 'Change Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-layout { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }
    .avatar-card { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; position: sticky; top: 80px; }
    .mx-auto { margin: 0 auto; }
    .profile-name { font-weight: 700; font-size: 1rem; }
    .profile-email { font-size: 0.82rem; color: var(--gray-500); }
    .profile-role { display: inline-flex; }
    .profile-forms { display: flex; flex-direction: column; gap: 20px; }
    .form-section-title { font-size: 1rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    small.text-muted { font-size: 0.78rem; color: var(--gray-400); display: block; margin-top: 4px; }
    @media (max-width: 768px) { .profile-layout { grid-template-columns: 1fr; } .avatar-card { position: static; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  profileForm!: FormGroup;
  passForm!: FormGroup;
  savingProfile = false;
  savingPass = false;
  profileSuccess = false;
  profileError = '';
  passSuccess = false;
  passError = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.profileForm = this.fb.group({
      firstName: [this.user?.firstName || '', Validators.required],
      lastName:  [this.user?.lastName  || '', Validators.required],
      email:     [{ value: this.user?.email || '', disabled: true }],
      phone:     [this.user?.phone || ''],
      bio:       [this.user?.bio || '']
    });
    this.passForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword:     ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatch });
  }

  get pf()      { return this.profileForm.controls; }
  get passf()   { return this.passForm.controls; }
  get initials(): string {
    if (!this.user) return '';
    return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
  }

  passwordMatch(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  saveProfile() {
    if (this.profileForm.invalid) { this.profileForm.markAllAsTouched(); return; }
    if (!this.user) return;
    this.savingProfile = true;
    this.profileSuccess = false;
    this.profileError = '';
    this.userService.updateProfile(this.user.id, this.profileForm.value).subscribe({
      next: () => { this.savingProfile = false; this.profileSuccess = true; setTimeout(() => this.profileSuccess = false, 3000); },
      error: err => { this.savingProfile = false; this.profileError = err.userMessage || 'Update failed.'; }
    });
  }

  changePassword() {
    if (this.passForm.invalid) { this.passForm.markAllAsTouched(); return; }
    if (!this.user) return;
    this.savingPass = true;
    this.passSuccess = false;
    this.passError = '';
    const { currentPassword, newPassword } = this.passForm.value;
    this.userService.updatePassword(this.user.id, { currentPassword, newPassword }).subscribe({
      next: () => {
        this.savingPass = false; this.passSuccess = true;
        this.passForm.reset();
        setTimeout(() => this.passSuccess = false, 3000);
      },
      error: err => { this.savingPass = false; this.passError = err.userMessage || 'Password change failed.'; }
    });
  }
}
