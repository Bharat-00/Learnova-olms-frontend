import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fade-in">
      <div class="page-header"><div><h1 class="page-title">Send Notification</h1><p class="page-subtitle">Broadcast announcements to platform users</p></div></div>

      <div class="notify-layout">
        <div class="card notify-form">
          <h3 class="form-section-title">Compose Notification</h3>

          <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
          <div class="alert alert-danger"  *ngIf="errorMsg"><i class="fas fa-exclamation-circle"></i> {{ errorMsg }}</div>

          <form [formGroup]="form" (ngSubmit)="send()">
            <div class="form-group">
              <label class="form-label">Title <span class="req">*</span></label>
              <input type="text" formControlName="title" class="form-control"
                     [class.is-invalid]="f['title'].invalid && f['title'].touched"
                     placeholder="Notification title">
              <div class="invalid-feedback" *ngIf="f['title'].invalid && f['title'].touched">Title is required.</div>
            </div>

            <div class="form-group">
              <label class="form-label">Message <span class="req">*</span></label>
              <textarea formControlName="message" class="form-control"
                        [class.is-invalid]="f['message'].invalid && f['message'].touched"
                        rows="4" placeholder="Write your notification message..."></textarea>
              <div class="invalid-feedback" *ngIf="f['message'].invalid && f['message'].touched">Message is required.</div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select formControlName="type" class="form-control form-select">
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="INFO">Information</option>
                  <option value="SUCCESS">Success</option>
                  <option value="WARNING">Warning</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Target Audience</label>
                <select formControlName="targetRole" class="form-control form-select">
                  <option value="">All Users</option>
                  <option value="STUDENT">Students Only</option>
                  <option value="INSTRUCTOR">Instructors Only</option>
                  <option value="ADMIN">Admins Only</option>
                </select>
              </div>
            </div>

            <!-- Preview -->
            <div class="preview-section">
              <label class="form-label">Preview</label>
              <div class="notification-preview" [ngClass]="f['type'].value?.toLowerCase()">
                <div class="np-icon"><i class="fas" [ngClass]="typeIcon(f['type'].value)"></i></div>
                <div class="np-content">
                  <div class="np-title">{{ f['title'].value || 'Your title here' }}</div>
                  <div class="np-message">{{ f['message'].value || 'Your message will appear here...' }}</div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="sending">
              <span *ngIf="sending" class="spinner-sm"></span>
              <i *ngIf="!sending" class="fas fa-paper-plane"></i>
              {{ sending ? 'Sending...' : 'Send Notification' }}
            </button>
          </form>
        </div>

        <div class="notify-sidebar">
          <div class="card">
            <h4 style="font-size:0.875rem;font-weight:700;margin-bottom:14px">Notification Tips</h4>
            <ul class="tips-list">
              <li><i class="fas fa-check" style="color:var(--success)"></i> Keep titles short and clear (under 60 chars)</li>
              <li><i class="fas fa-check" style="color:var(--success)"></i> Explain the action users should take</li>
              <li><i class="fas fa-check" style="color:var(--success)"></i> Target specific roles to avoid noise</li>
              <li><i class="fas fa-check" style="color:var(--success)"></i> Use WARNING type sparingly</li>
            </ul>
          </div>
          <div class="card" style="margin-top:16px">
            <h4 style="font-size:0.875rem;font-weight:700;margin-bottom:14px">Recent Broadcasts</h4>
            <div *ngFor="let r of recentBroadcasts" class="recent-broadcast">
              <div class="rb-title">{{ r.title }}</div>
              <div class="rb-date">{{ r.date }}</div>
            </div>
            <div *ngIf="recentBroadcasts.length === 0" class="text-muted text-sm" style="text-align:center;padding:16px">
              No recent broadcasts.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notify-layout { display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: start; }
    .form-section-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
    .req { color: var(--danger); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .preview-section { margin-bottom: 20px; }
    .notification-preview { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--radius); border: 1px solid var(--gray-200); }
    .notification-preview.announcement { background: var(--info-light); border-color: var(--info); }
    .notification-preview.info         { background: var(--primary-light); border-color: var(--primary); }
    .notification-preview.success      { background: var(--success-light); border-color: var(--success); }
    .notification-preview.warning      { background: var(--warning-light); border-color: var(--warning); }
    .np-icon { font-size: 1.1rem; color: var(--primary); flex-shrink: 0; margin-top: 2px; }
    .np-title { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .np-message { font-size: 0.82rem; color: var(--gray-600); margin-top: 3px; line-height: 1.5; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .tips-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .tips-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; color: var(--gray-600); line-height: 1.5; }
    .recent-broadcast { padding: 8px 0; border-bottom: 1px solid var(--gray-100); }
    .recent-broadcast:last-child { border-bottom: none; }
    .rb-title { font-size: 0.82rem; font-weight: 500; color: var(--gray-700); }
    .rb-date { font-size: 0.72rem; color: var(--gray-400); margin-top: 2px; }
    @media (max-width: 768px) { .notify-layout { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
  `]
})
export class AdminNotificationsComponent {
  form: FormGroup;
  sending = false;
  successMsg = '';
  errorMsg = '';
  recentBroadcasts: { title: string; date: string }[] = [];

  constructor(private fb: FormBuilder, private notifService: NotificationService) {
    this.form = this.fb.group({
      title:      ['', Validators.required],
      message:    ['', Validators.required],
      type:       ['ANNOUNCEMENT'],
      targetRole: ['']
    });
  }

  get f() { return this.form.controls; }

  typeIcon(type: string): string {
    return { ANNOUNCEMENT: 'fa-bullhorn', INFO: 'fa-info-circle', SUCCESS: 'fa-check-circle', WARNING: 'fa-exclamation-triangle' }[type] || 'fa-bell';
  }

  send() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.sending = true; this.successMsg = ''; this.errorMsg = '';
    this.notifService.sendBulkNotification(this.form.value).subscribe({
      next: () => {
        this.sending = false;
        this.successMsg = 'Notification sent successfully to all targeted users!';
        this.recentBroadcasts.unshift({ title: this.form.value.title, date: new Date().toLocaleDateString() });
        this.form.reset({ type: 'ANNOUNCEMENT', targetRole: '' });
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: err => { this.sending = false; this.errorMsg = err.userMessage || 'Failed to send notification.'; }
    });
  }
}
