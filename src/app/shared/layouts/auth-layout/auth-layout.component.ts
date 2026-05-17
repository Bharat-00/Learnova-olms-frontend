import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-left">
        <div class="auth-left-inner">
          <a routerLink="/" class="auth-brand">
            <div class="brand-icon"><i class="fas fa-graduation-cap"></i></div>
            <span>Learnova</span>
          </a>
          <div class="auth-illustration">
            <div class="illustration-circles">
              <div class="circle c1"></div>
              <div class="circle c2"></div>
              <div class="circle c3"></div>
            </div>
            <div class="illustration-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
          </div>
          <div class="auth-left-content">
            <h2>Start Your Learning Journey Today</h2>
            <p>Join thousands of learners building in-demand skills with Learnova's expert-led courses.</p>
            <div class="auth-features">
              <div class="auth-feature" *ngFor="let f of features">
                <div class="feature-check"><i class="fas fa-check"></i></div>
                <span>{{ f }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: 100vh;
      display: flex;
    }
    .auth-left {
      width: 45%;
      background: linear-gradient(145deg, #0f4fd1 0%, #1a6bff 50%, #3b8aff 100%);
      display: flex; align-items: center; justify-content: center;
      padding: 48px;
      position: relative; overflow: hidden;
    }
    .auth-left-inner { position: relative; z-index: 2; max-width: 380px; }
    .auth-brand {
      display: flex; align-items: center; gap: 10px;
      text-decoration: none; margin-bottom: 48px;
    }
    .brand-icon {
      width: 36px; height: 36px; border-radius: 10px;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 0.9rem;
    }
    .auth-brand span {
      font-family: var(--font-display); font-size: 1.3rem;
      font-weight: 700; color: #fff;
    }
    .illustration-circles { position: relative; height: 180px; margin-bottom: 32px; }
    .circle {
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,0.08);
    }
    .c1 { width: 160px; height: 160px; top: 0; left: 0; }
    .c2 { width: 100px; height: 100px; top: 30px; left: 80px; background: rgba(255,255,255,0.12); }
    .c3 { width: 60px; height: 60px; top: 60px; left: 160px; background: rgba(255,255,255,0.16); }
    .illustration-icon {
      position: absolute; top: 40px; left: 40px;
      font-size: 4rem; color: rgba(255,255,255,0.9);
    }
    .auth-left-content h2 {
      font-family: var(--font-display); font-size: 1.6rem; font-weight: 700;
      color: #fff; margin-bottom: 12px; line-height: 1.3;
    }
    .auth-left-content p {
      color: rgba(255,255,255,0.75); font-size: 0.95rem; line-height: 1.7; margin-bottom: 28px;
    }
    .auth-features { display: flex; flex-direction: column; gap: 12px; }
    .auth-feature {
      display: flex; align-items: center; gap: 12px;
      color: rgba(255,255,255,0.9); font-size: 0.9rem;
    }
    .feature-check {
      width: 24px; height: 24px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.65rem; color: #fff; flex-shrink: 0;
    }
    .auth-right {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 40px 24px; background: var(--gray-50);
    }
    @media (max-width: 900px) {
      .auth-left { display: none; }
      .auth-right { width: 100%; }
    }
  `]
})
export class AuthLayoutComponent {
  features = [
    '500+ Expert-led courses',
    'Learn at your own pace',
    'Get certified on completion',
    'Mobile-friendly platform'
  ];
}
