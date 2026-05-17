import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-instructor-notifications',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div><h1 class="page-title">Notifications</h1><p class="page-subtitle">Stay updated with your courses and students</p></div>
        <button class="btn btn-outline" *ngIf="unreadCount > 0" (click)="markAllRead()">
          <i class="fas fa-check-double"></i> Mark All Read
        </button>
      </div>
      <app-loading-spinner *ngIf="loading" />
      <div class="notif-list" *ngIf="!loading && notifications.length > 0">
        <div class="notif-item card" *ngFor="let n of notifications"
             [class.unread]="!n.read" (click)="markRead(n)">
          <div class="ni-icon" [ngClass]="n.type.toLowerCase()">
            <i class="fas" [ngClass]="typeIcon(n.type)"></i>
          </div>
          <div class="ni-content">
            <div class="ni-title">{{ n.title }}</div>
            <div class="ni-msg">{{ n.message }}</div>
            <div class="ni-time"><i class="fas fa-clock"></i> {{ n.createdAt | date:'medium' }}</div>
          </div>
          <div class="ni-dot" *ngIf="!n.read"></div>
        </div>
      </div>
      <div *ngIf="!loading && notifications.length === 0" class="empty-msg">
        <i class="fas fa-bell-slash"></i>
        <p>No notifications at the moment.</p>
      </div>
    </div>
  `,
  styles: [`
    .notif-list { display:flex;flex-direction:column;gap:10px; }
    .notif-item { display:flex;align-items:flex-start;gap:14px;cursor:pointer;transition:var(--transition); }
    .notif-item.unread { border-left:3px solid var(--primary);background:var(--primary-subtle); }
    .ni-icon { width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0; }
    .ni-icon.info         { background:var(--primary-light);color:var(--primary); }
    .ni-icon.success      { background:var(--success-light);color:var(--success); }
    .ni-icon.warning      { background:var(--warning-light);color:var(--warning); }
    .ni-icon.announcement { background:var(--info-light);color:var(--info); }
    .ni-content { flex:1; }
    .ni-title  { font-size:0.875rem;font-weight:600;margin-bottom:3px; }
    .ni-msg    { font-size:0.82rem;color:var(--gray-500);line-height:1.5;margin-bottom:5px; }
    .ni-time   { font-size:0.72rem;color:var(--gray-400);display:flex;align-items:center;gap:4px; }
    .ni-dot    { width:9px;height:9px;border-radius:50%;background:var(--primary);flex-shrink:0;margin-top:5px; }
    .empty-msg { text-align:center;padding:48px;color:var(--gray-400); }
    .empty-msg i { font-size:2.5rem;display:block;margin-bottom:12px; }
  `]
})
export class InstructorNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  unreadCount = 0;
  constructor(private notifService: NotificationService) {}
  ngOnInit() {
    this.notifService.unreadCount$.subscribe(c => this.unreadCount = c);
    this.notifService.getMyNotifications(0, 30).subscribe({
      next: res => { this.notifications = res.content || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  markRead(n: Notification) { if (!n.read) { n.read = true; this.notifService.markAsRead(n.id).subscribe(); } }
  markAllRead() { this.notifService.markAllAsRead().subscribe(() => this.notifications.forEach(n => n.read = true)); }
  typeIcon(t: string): string { return {INFO:'fa-info-circle',SUCCESS:'fa-check-circle',WARNING:'fa-exclamation-triangle',ANNOUNCEMENT:'fa-bullhorn'}[t]||'fa-bell'; }
}
