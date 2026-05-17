import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Stay updated with your learning activity</p>
        </div>
        <button class="btn btn-outline" *ngIf="unreadCount > 0" (click)="markAllRead()">
          <i class="fas fa-check-double"></i> Mark All Read
        </button>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="notif-page-list" *ngIf="!loading && notifications.length > 0">
        <div class="notif-page-item card" *ngFor="let n of notifications"
             [class.unread]="!n.read" (click)="markRead(n)">
          <div class="npi-icon" [ngClass]="n.type.toLowerCase()">
            <i class="fas" [ngClass]="typeIcon(n.type)"></i>
          </div>
          <div class="npi-content">
            <div class="npi-title">{{ n.title }}</div>
            <div class="npi-message">{{ n.message }}</div>
            <div class="npi-time"><i class="fas fa-clock"></i> {{ n.createdAt | date:'medium' }}</div>
          </div>
          <div class="npi-status">
            <div class="unread-dot" *ngIf="!n.read"></div>
            <span class="read-label" *ngIf="n.read">Read</span>
          </div>
        </div>

        <div class="load-more" *ngIf="hasMore">
          <button class="btn btn-secondary" (click)="loadMore()" [disabled]="loadingMore">
            <span *ngIf="loadingMore" class="spinner-sm-dark"></span>
            {{ loadingMore ? 'Loading...' : 'Load More' }}
          </button>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && notifications.length === 0"
        icon="fa-bell-slash" title="All caught up!"
        message="No notifications at the moment. We'll notify you when something happens." />
    </div>
  `,
  styles: [`
    .notif-page-list { display: flex; flex-direction: column; gap: 10px; }
    .notif-page-item { display: flex; align-items: flex-start; gap: 16px; cursor: pointer; transition: var(--transition); }
    .notif-page-item:hover { border-color: var(--primary); }
    .notif-page-item.unread { border-left: 3px solid var(--primary); background: var(--primary-subtle); }
    .npi-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0; }
    .npi-icon.info         { background: var(--primary-light); color: var(--primary); }
    .npi-icon.success      { background: var(--success-light); color: var(--success); }
    .npi-icon.warning      { background: var(--warning-light); color: var(--warning); }
    .npi-icon.announcement { background: var(--info-light); color: var(--info); }
    .npi-content { flex: 1; }
    .npi-title { font-size: 0.9rem; font-weight: 600; color: var(--gray-800); margin-bottom: 4px; }
    .npi-message { font-size: 0.85rem; color: var(--gray-500); line-height: 1.5; margin-bottom: 6px; }
    .npi-time { font-size: 0.75rem; color: var(--gray-400); display: flex; align-items: center; gap: 5px; }
    .npi-status { display: flex; align-items: flex-start; flex-shrink: 0; }
    .unread-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); margin-top: 4px; }
    .read-label { font-size: 0.72rem; color: var(--gray-400); }
    .load-more { text-align: center; padding: 20px 0; }
    .spinner-sm-dark { display: inline-block; width: 14px; height: 14px; border: 2px solid var(--gray-300); border-top-color: var(--gray-600); border-radius: 50%; animation: spin 0.6s linear infinite; }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  loadingMore = false;
  unreadCount = 0;
  page = 0;
  hasMore = false;

  constructor(private notifService: NotificationService) {}

  ngOnInit() {
    this.notifService.unreadCount$.subscribe(c => this.unreadCount = c);
    this.loadNotifications();
  }

  loadNotifications() {
    this.notifService.getMyNotifications(this.page, 20).subscribe({
      next: res => {
        this.notifications = [...this.notifications, ...(res.content || [])];
        this.hasMore = !res.last;
        this.loading = false;
        this.loadingMore = false;
      },
      error: () => { this.loading = false; this.loadingMore = false; }
    });
  }

  loadMore() {
    this.page++;
    this.loadingMore = true;
    this.loadNotifications();
  }

  markRead(n: Notification) {
    if (!n.read) {
      n.read = true;
      this.unreadCount = Math.max(0, this.unreadCount - 1);
      this.notifService.markAsRead(n.id).subscribe();
    }
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    });
  }

  typeIcon(type: string): string {
    const map: Record<string, string> = { INFO: 'fa-info-circle', SUCCESS: 'fa-check-circle', WARNING: 'fa-exclamation-triangle', ANNOUNCEMENT: 'fa-bullhorn' };
    return map[type] || 'fa-bell';
  }
}
