import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="notif-wrapper" (click)="toggleDropdown($event)">
      <button class="notif-btn">
        <i class="fas fa-bell"></i>
        <span class="notif-count" *ngIf="unreadCount > 0">
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>

      <div class="notif-dropdown" *ngIf="open" (click)="$event.stopPropagation()">
        <div class="notif-header">
          <span>Notifications</span>
          <button *ngIf="unreadCount > 0" class="mark-all-btn" (click)="markAllRead()">
            Mark all read
          </button>
        </div>
        <div class="notif-list">
          <div *ngIf="loading" class="notif-loading">
            <div class="spinner-sm2"></div>
          </div>
          <div *ngIf="!loading && notifications.length === 0" class="notif-empty">
            <i class="fas fa-bell-slash"></i>
            <span>No notifications</span>
          </div>
          <div *ngFor="let n of notifications"
               class="notif-item" [class.unread]="!n.read"
               (click)="markRead(n)">
            <div class="notif-dot" *ngIf="!n.read"></div>
            <div class="notif-content">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-message">{{ n.message }}</div>
              <div class="notif-time">{{ n.createdAt | date:'short' }}</div>
            </div>
          </div>
        </div>
        <div class="notif-footer">
          <a routerLink="notifications" (click)="open=false">View all notifications</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notif-wrapper { position: relative; }
    .notif-btn {
      position: relative; border: none; background: var(--gray-100);
      width: 40px; height: 40px; border-radius: var(--radius);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--gray-600); font-size: 1rem;
      transition: var(--transition);
    }
    .notif-btn:hover { background: var(--primary-light); color: var(--primary); }
    .notif-count {
      position: absolute; top: -4px; right: -4px;
      background: var(--danger); color: #fff;
      font-size: 0.6rem; font-weight: 700;
      min-width: 16px; height: 16px; border-radius: var(--radius-full);
      display: flex; align-items: center; justify-content: center;
      padding: 0 3px; border: 2px solid var(--white);
    }
    .notif-dropdown {
      position: absolute; right: 0; top: calc(100% + 8px);
      width: 340px; background: var(--white);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-md);
      z-index: 400; animation: fadeInDown 0.15s ease; overflow: hidden;
    }
    .notif-header {
      padding: 14px 16px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid var(--gray-100);
      font-weight: 600; font-size: 0.9rem;
    }
    .mark-all-btn {
      font-size: 0.78rem; color: var(--primary); border: none; background: none;
      cursor: pointer; font-weight: 500;
    }
    .mark-all-btn:hover { text-decoration: underline; }
    .notif-list { max-height: 320px; overflow-y: auto; }
    .notif-loading, .notif-empty {
      padding: 24px; display: flex; align-items: center; justify-content: center;
      gap: 8px; color: var(--gray-400); font-size: 0.875rem;
    }
    .notif-item {
      display: flex; gap: 10px; padding: 12px 16px;
      cursor: pointer; transition: var(--transition);
      border-bottom: 1px solid var(--gray-50);
    }
    .notif-item:hover { background: var(--gray-50); }
    .notif-item.unread { background: var(--primary-subtle); }
    .notif-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--primary); flex-shrink: 0; margin-top: 6px;
    }
    .notif-content { flex: 1; min-width: 0; }
    .notif-title { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); }
    .notif-message { font-size: 0.8rem; color: var(--gray-500); margin-top: 2px;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .notif-time { font-size: 0.72rem; color: var(--gray-400); margin-top: 4px; }
    .notif-footer {
      padding: 12px 16px; text-align: center;
      border-top: 1px solid var(--gray-100);
    }
    .notif-footer a { font-size: 0.85rem; color: var(--primary); font-weight: 500; }
    .spinner-sm2 {
      width: 20px; height: 20px;
      border: 2px solid var(--gray-200); border-top-color: var(--primary);
      border-radius: 50%; animation: spin 0.6s linear infinite;
    }
  `]
})
export class NotificationBellComponent implements OnInit {
  open = false;
  unreadCount = 0;
  notifications: Notification[] = [];
  loading = false;

  constructor(private notifService: NotificationService) {}

  ngOnInit() {
    this.notifService.unreadCount$.subscribe(c => this.unreadCount = c);
    this.notifService.getUnreadCount().subscribe();
  }

  toggleDropdown(e: Event) {
    e.stopPropagation();
    this.open = !this.open;
    if (this.open) {
      this.loadNotifications();
      setTimeout(() => document.addEventListener('click', () => this.open = false, { once: true }), 0);
    }
  }

  loadNotifications() {
    this.loading = true;
    this.notifService.getMyNotifications(0, 8).subscribe({
      next: res => { this.notifications = res.content || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  markRead(n: Notification) {
    if (!n.read) {
      n.read = true;
      this.notifService.markAsRead(n.id).subscribe();
    }
  }

  markAllRead() {
    this.notifService.markAllAsRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
    });
  }
}
