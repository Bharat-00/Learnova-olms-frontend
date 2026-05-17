import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <aside class="sidebar" [class.open]="open">
      <div class="sidebar-header">
        <a routerLink="/" class="sidebar-brand">
          <div class="brand-icon"><i class="fas fa-graduation-cap"></i></div>
          <span>Learnova</span>
        </a>
        <button class="sidebar-close" (click)="close.emit()">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="sidebar-user">
        <div class="avatar">{{ initials }}</div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ role }}</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section" *ngFor="let section of navSections">
          <div class="nav-section-label" *ngIf="section.label">{{ section.label }}</div>
          <a *ngFor="let item of section.items"
             [routerLink]="item.route"
             routerLinkActive="active"
             class="nav-item"
             (click)="close.emit()">
            <i class="fas {{ item.icon }}"></i>
            <span>{{ item.label }}</span>
            <span class="nav-badge" *ngIf="item.badge && item.badge > 0">{{ item.badge }}</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout()">
          <i class="fas fa-sign-out-alt"></i>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay" [class.visible]="open" (click)="close.emit()"></div>
  `,
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: var(--sidebar-width);
      background: var(--white);
      border-right: 1px solid var(--gray-200);
      display: flex; flex-direction: column;
      z-index: 300;
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      overflow-y: auto;
    }
    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px;
      border-bottom: 1px solid var(--gray-100);
      flex-shrink: 0;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
    }
    .brand-icon {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, var(--primary), #4d9dff);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 0.8rem;
    }
    .sidebar-brand span {
      font-family: var(--font-display); font-size: 1.1rem; font-weight: 700;
      color: var(--gray-900);
    }
    .sidebar-close {
      display: none; border: none; background: none;
      cursor: pointer; color: var(--gray-500); font-size: 1rem; padding: 4px;
    }
    .sidebar-user {
      padding: 16px 20px;
      display: flex; align-items: center; gap: 12px;
      background: var(--gray-50);
      border-bottom: 1px solid var(--gray-100);
    }
    .user-info { min-width: 0; }
    .user-name {
      font-weight: 600; font-size: 0.875rem;
      color: var(--gray-800); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .user-role {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
      color: var(--primary); text-transform: uppercase; margin-top: 2px;
    }
    .sidebar-nav { flex: 1; padding: 12px 12px; overflow-y: auto; }
    .nav-section { margin-bottom: 4px; }
    .nav-section-label {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--gray-400);
      padding: 10px 10px 6px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 12px; border-radius: var(--radius);
      font-size: 0.875rem; font-weight: 500;
      color: var(--gray-600);
      transition: var(--transition);
      text-decoration: none;
      margin-bottom: 2px;
    }
    .nav-item i { width: 18px; text-align: center; font-size: 0.9rem; flex-shrink: 0; }
    .nav-item:hover { background: var(--primary-light); color: var(--primary); }
    .nav-item.active { background: var(--primary-light); color: var(--primary); font-weight: 600; }
    .nav-item.active i { color: var(--primary); }
    .nav-badge {
      margin-left: auto; background: var(--danger); color: #fff;
      font-size: 0.65rem; font-weight: 700; min-width: 18px; height: 18px;
      border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;
      padding: 0 4px;
    }
    .sidebar-footer {
      padding: 12px 12px 20px;
      border-top: 1px solid var(--gray-100);
    }
    .logout-btn {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 10px 12px;
      border: none; background: none; border-radius: var(--radius);
      font-size: 0.875rem; font-weight: 500;
      color: var(--gray-500); cursor: pointer;
      transition: var(--transition);
    }
    .logout-btn:hover { background: var(--danger-light); color: var(--danger); }
    .logout-btn i { width: 18px; text-align: center; }
    .sidebar-overlay {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.4); z-index: 299;
    }
    @media (max-width: 768px) {
      .sidebar { transform: translateX(-100%); box-shadow: var(--shadow-lg); }
      .sidebar.open { transform: translateX(0); }
      .sidebar-close { display: flex; }
      .sidebar-overlay.visible { display: block; }
    }
  `]
})
export class SidebarComponent implements OnInit {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  userName = '';
  initials = '';
  role = '';
  unreadNotifications = 0;
  navSections: { label: string; items: NavItem[] }[] = [];

  constructor(private authService: AuthService, private notifService: NotificationService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        this.role = user.role;
        this.buildNav(user.role);
      }
    });
    this.notifService.unreadCount$.subscribe(count => {
      this.unreadNotifications = count;
      this.updateNotificationBadge();
    });
  }

  private updateNotificationBadge() {
    this.navSections.forEach(section => {
      section.items.forEach(item => {
        if (item.route.includes('notifications')) {
          item.badge = this.unreadNotifications;
        }
      });
    });
  }

  private buildNav(role: string) {
    if (role === 'STUDENT') {
      this.navSections = [
        {
          label: '',
          items: [
            { label: 'Dashboard',     icon: 'fa-th-large',       route: '/student/dashboard' },
            { label: 'My Courses',    icon: 'fa-book-open',      route: '/student/courses' },
            { label: 'My Progress',   icon: 'fa-chart-line',     route: '/student/progress' },
          ]
        },
        {
          label: 'Learning',
          items: [
            { label: 'Discussions',   icon: 'fa-comments',       route: '/student/discussions' },
            { label: 'Certificates',  icon: 'fa-certificate',    route: '/student/certificates' },
          ]
        },
        {
          label: 'Account',
          items: [
            { label: 'Payments',      icon: 'fa-credit-card',    route: '/student/payments' },
            { label: 'Notifications', icon: 'fa-bell',           route: '/student/notifications', badge: 0 },
            { label: 'Profile',       icon: 'fa-user-circle',    route: '/student/profile' },
          ]
        }
      ];
    } else if (role === 'INSTRUCTOR') {
      this.navSections = [
        {
          label: '',
          items: [
            { label: 'Dashboard',      icon: 'fa-th-large',       route: '/instructor/dashboard' },
            { label: 'My Courses',     icon: 'fa-book',           route: '/instructor/courses' },
            { label: 'Students',       icon: 'fa-users',          route: '/instructor/students' },
          ]
        },
        {
          label: 'Content',
          items: [
            { label: 'Discussions',    icon: 'fa-comments',       route: '/instructor/discussions' },
            { label: 'Analytics',      icon: 'fa-chart-bar',      route: '/instructor/analytics' },
          ]
        },
        {
          label: 'Account',
          items: [
            { label: 'Notifications',  icon: 'fa-bell',           route: '/instructor/notifications', badge: 0 },
            { label: 'Profile',        icon: 'fa-user-circle',    route: '/instructor/profile' },
          ]
        }
      ];
    } else {
      this.navSections = [
        {
          label: '',
          items: [
            { label: 'Dashboard',       icon: 'fa-th-large',      route: '/admin/dashboard' },
            { label: 'Users',           icon: 'fa-users',         route: '/admin/users' },
            { label: 'Courses',         icon: 'fa-book',          route: '/admin/courses' },
          ]
        },
        {
          label: 'Finance',
          items: [
            { label: 'Payments',        icon: 'fa-credit-card',   route: '/admin/payments' },
            { label: 'Subscriptions',   icon: 'fa-layer-group',   route: '/admin/subscriptions' },
            { label: 'Certificates',    icon: 'fa-certificate',   route: '/admin/certificates' },
          ]
        },
        {
          label: 'Platform',
          items: [
            { label: 'Analytics',       icon: 'fa-chart-pie',     route: '/admin/analytics' },
            { label: 'Discussions',     icon: 'fa-comments',      route: '/admin/discussions' },
            { label: 'Notifications',   icon: 'fa-bell',          route: '/admin/notifications', badge: 0 },
            { label: 'Profile',         icon: 'fa-user-circle',   route: '/admin/profile' },
          ]
        }
      ];
    }
    this.updateNotificationBadge();
  }

  logout() {
    this.authService.logout();
  }
}
