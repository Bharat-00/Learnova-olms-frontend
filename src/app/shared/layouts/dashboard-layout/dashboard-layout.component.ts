import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent, NotificationBellComponent],
  template: `
    <div class="dashboard-wrapper">
      <app-sidebar [open]="sidebarOpen" (close)="sidebarOpen = false" />

      <div class="dashboard-content">
        <header class="dashboard-topbar">
          <div class="topbar-left">
            <button class="menu-toggle" (click)="sidebarOpen = !sidebarOpen">
              <i class="fas fa-bars"></i>
            </button>
            <div class="breadcrumb-area">
              <span class="page-context">{{ roleLabel }}</span>
            </div>
          </div>

          <div class="topbar-right">
            <app-notification-bell />
            <div class="topbar-user" (click)="toggleUserMenu($event)">
              <div class="avatar avatar-sm">{{ initials }}</div>
              <div class="user-text">
                <div class="user-name-sm">{{ userName }}</div>
                <div class="user-role-sm">{{ role }}</div>
              </div>
              <i class="fas fa-chevron-down topbar-chevron"></i>

              <div class="topbar-dropdown" *ngIf="userMenuOpen">
                <div class="dropdown-item" (click)="navigateTo('profile')">
                  <i class="fas fa-user-circle"></i> My Profile
                </div>
                <div class="dropdown-item" (click)="navigateTo('dashboard')">
                  <i class="fas fa-th-large"></i> Dashboard
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item text-danger" (click)="logout()">
                  <i class="fas fa-sign-out-alt"></i> Log Out
                </div>
              </div>
            </div>
          </div>
        </header>

        <main class="dashboard-main">
          <router-outlet />
        </main>

        <footer class="dashboard-footer">
          <p>&copy; {{ year }} Learnova OLMS. All rights reserved.</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .topbar-left { display: flex; align-items: center; gap: 14px; }
    .menu-toggle {
      border: none; background: var(--gray-100);
      width: 36px; height: 36px; border-radius: var(--radius);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: var(--gray-600); font-size: 0.95rem;
      transition: var(--transition);
    }
    .menu-toggle:hover { background: var(--primary-light); color: var(--primary); }
    .page-context {
      font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--gray-400);
    }
    .topbar-right { display: flex; align-items: center; gap: 12px; }
    .topbar-user {
      display: flex; align-items: center; gap: 10px;
      cursor: pointer; padding: 6px 10px;
      border-radius: var(--radius); position: relative;
      transition: var(--transition);
    }
    .topbar-user:hover { background: var(--gray-100); }
    .user-text { display: flex; flex-direction: column; }
    .user-name-sm { font-size: 0.85rem; font-weight: 600; color: var(--gray-800); line-height: 1; }
    .user-role-sm {
      font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em;
      text-transform: uppercase; color: var(--primary); margin-top: 2px;
    }
    .topbar-chevron { font-size: 0.7rem; color: var(--gray-400); }
    .topbar-dropdown {
      position: absolute; right: 0; top: calc(100% + 8px);
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); box-shadow: var(--shadow-md);
      min-width: 190px; z-index: 300;
      animation: fadeInDown 0.15s ease; overflow: hidden;
    }
    .text-danger { color: var(--danger) !important; }
    .dashboard-footer {
      padding: 16px 28px;
      border-top: 1px solid var(--gray-200);
      background: var(--white);
      font-size: 0.8rem; color: var(--gray-400);
    }
    @media (max-width: 768px) {
      .user-text { display: none; }
      .topbar-chevron { display: none; }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  sidebarOpen = false;
  userMenuOpen = false;
  userName = '';
  initials = '';
  role = '';
  roleLabel = '';
  year = new Date().getFullYear();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        this.role = user.role;
        const map: Record<string, string> = {
          STUDENT: 'Student Portal', INSTRUCTOR: 'Instructor Portal', ADMIN: 'Admin Portal'
        };
        this.roleLabel = map[user.role] || 'Dashboard';
      }
    });
  }

  toggleUserMenu(e: Event) {
    e.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      setTimeout(() => document.addEventListener('click', () => this.userMenuOpen = false, { once: true }), 0);
    }
  }

  navigateTo(page: string) {
    this.userMenuOpen = false;
    const base = this.role.toLowerCase();
    this.router.navigate([`/${base}/${page}`]);
  }

  logout() {
    this.authService.logout();
  }
}
