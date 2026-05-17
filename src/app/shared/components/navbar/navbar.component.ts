import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled">
      <div class="nav-container">
        <a routerLink="/" class="nav-brand">
          <div class="brand-icon">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <span class="brand-name">Learnova</span>
        </a>

        <div class="nav-links" [class.open]="menuOpen">
          <a routerLink="/"       routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" (click)="menuOpen=false">Home</a>
          <a routerLink="/courses" routerLinkActive="active" (click)="menuOpen=false">Courses</a>
          <a routerLink="/about"   routerLinkActive="active" (click)="menuOpen=false">About</a>
          <a routerLink="/contact" routerLinkActive="active" (click)="menuOpen=false">Contact</a>
        </div>

        <div class="nav-actions">
          <ng-container *ngIf="!isLoggedIn; else userMenu">
            <a routerLink="/login" class="btn btn-outline btn-sm">Log In</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
          </ng-container>
          <ng-template #userMenu>
            <div class="user-dropdown" (click)="toggleUserMenu($event)">
              <div class="avatar">{{ initials }}</div>
              <div class="user-dropdown-menu" *ngIf="userMenuOpen">
                <div class="user-info-header">
                  <div class="avatar avatar-sm">{{ initials }}</div>
                  <div>
                    <div class="user-full-name">{{ userName }}</div>
                    <div class="user-role-badge">{{ role }}</div>
                  </div>
                </div>
                <hr class="dropdown-divider">
                <button class="dropdown-item" (click)="goToDashboard()">
                  <i class="fas fa-th-large"></i> Dashboard
                </button>
                <hr class="dropdown-divider">
                <button class="dropdown-item text-danger" (click)="logout()">
                  <i class="fas fa-sign-out-alt"></i> Log Out
                </button>
              </div>
            </div>
          </ng-template>
          <button class="nav-toggle" (click)="menuOpen=!menuOpen">
            <i class="fas" [class.fa-bars]="!menuOpen" [class.fa-times]="menuOpen"></i>
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky; top: 0; z-index: 500;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid transparent;
      transition: var(--transition-slow);
    }
    .navbar.scrolled {
      border-bottom-color: var(--gray-200);
      box-shadow: var(--shadow-sm);
    }
    .nav-container {
      max-width: 1200px; margin: 0 auto;
      padding: 0 24px;
      height: 68px;
      display: flex; align-items: center; justify-content: space-between; gap: 32px;
    }
    .nav-brand {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none;
    }
    .brand-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--primary), #4d9dff);
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 0.9rem;
    }
    .brand-name {
      font-family: var(--font-display);
      font-size: 1.25rem; font-weight: 700;
      color: var(--gray-900);
    }
    .nav-links {
      display: flex; align-items: center; gap: 4px; flex: 1;
    }
    .nav-links a {
      padding: 8px 14px;
      border-radius: var(--radius);
      font-size: 0.9rem; font-weight: 500;
      color: var(--gray-600);
      transition: var(--transition);
    }
    .nav-links a:hover, .nav-links a.active {
      background: var(--primary-light); color: var(--primary);
    }
    .nav-actions {
      display: flex; align-items: center; gap: 10px;
    }
    .user-dropdown { position: relative; cursor: pointer; }
    .user-dropdown-menu {
      position: absolute; right: 0; top: calc(100% + 10px);
      background: var(--white);
      border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      min-width: 220px; z-index: 300;
      animation: fadeInDown 0.15s ease;
      overflow: hidden;
    }
    .user-info-header {
      display: flex; align-items: center; gap: 12px;
      padding: 16px;
    }
    .user-full-name { font-weight: 600; font-size: 0.9rem; color: var(--gray-800); }
    .user-role-badge {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
      color: var(--primary); text-transform: uppercase;
      background: var(--primary-light); padding: 2px 8px;
      border-radius: var(--radius-full); display: inline-block; margin-top: 2px;
    }
    .nav-toggle {
      display: none; border: none; background: none;
      font-size: 1.1rem; cursor: pointer; color: var(--gray-600);
      padding: 8px;
    }
    @media (max-width: 768px) {
      .nav-links {
        display: none; position: absolute; top: 68px; left: 0; right: 0;
        background: var(--white); flex-direction: column; align-items: stretch;
        padding: 12px 16px; gap: 4px;
        border-bottom: 1px solid var(--gray-200); box-shadow: var(--shadow-md);
      }
      .nav-links.open { display: flex; }
      .nav-toggle { display: flex; }
      .navbar { position: relative; }
    }
  `]
})
export class NavbarComponent implements OnInit {
  scrolled = false;
  menuOpen = false;
  userMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  initials = '';
  role = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user && this.authService.isLoggedIn();
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        this.role = user.role;
      }
    });
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 10;
      });
    }
  }

  toggleUserMenu(e: Event) {
    e.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    if (this.userMenuOpen) {
      setTimeout(() => document.addEventListener('click', () => this.userMenuOpen = false, { once: true }), 0);
    }
  }

  goToDashboard() {
    this.userMenuOpen = false;
    this.router.navigate([this.authService.getDashboardRoute()]);
  }

  logout() {
    this.userMenuOpen = false;
    this.authService.logout();
  }
}
