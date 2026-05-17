import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, CommonModule, CourseCardComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content fade-in">
          <div class="hero-badge">
            <i class="fas fa-bolt"></i> The #1 Online Learning Platform
          </div>
          <h1 class="hero-title">
            Learn Without<br>
            <span class="hero-highlight">Limits.</span>
          </h1>
          <p class="hero-subtitle">
            Unlock your potential with 500+ expert-led courses. Learn at your own pace, earn certificates, and accelerate your career from anywhere.
          </p>
          <div class="hero-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">
              <i class="fas fa-rocket"></i> Start Learning Free
            </a>
            <a routerLink="/courses" class="btn btn-outline btn-lg">
              <i class="fas fa-compass"></i> Explore Courses
            </a>
          </div>
          <div class="hero-trust">
            <div class="trust-item">
              <span class="trust-num">50K+</span>
              <span class="trust-label">Students</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-item">
              <span class="trust-num">500+</span>
              <span class="trust-label">Courses</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-item">
              <span class="trust-num">98%</span>
              <span class="trust-label">Satisfaction</span>
            </div>
            <div class="trust-divider"></div>
            <div class="trust-item">
              <span class="trust-num">120+</span>
              <span class="trust-label">Instructors</span>
            </div>
          </div>
        </div>
        <div class="hero-visual fade-in fade-in-delay-2">
          <div class="hero-card-stack">
            <div class="floating-card fc1">
              <i class="fas fa-play-circle"></i>
              <div>
                <div class="fc-title">Web Development</div>
                <div class="fc-sub">2,480 students enrolled</div>
              </div>
            </div>
            <div class="floating-card fc2">
              <div class="fc-progress-wrap">
                <div class="fc-title">Course Progress</div>
                <div class="progress-bar-container" style="margin-top:8px">
                  <div class="progress-bar-fill" style="width:72%"></div>
                </div>
                <div class="fc-sub" style="margin-top:4px">72% completed</div>
              </div>
            </div>
            <div class="floating-card fc3">
              <i class="fas fa-certificate"></i>
              <div>
                <div class="fc-title">Certificate Earned!</div>
                <div class="fc-sub">React Masterclass</div>
              </div>
            </div>
            <div class="hero-main-visual">
              <div class="visual-blob"></div>
              <div class="visual-icon-wrap">
                <i class="fas fa-laptop-code"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="stats-bar">
      <div class="stats-bar-container">
        <div class="stat-item" *ngFor="let s of stats">
          <div class="stat-icon"><i class="fas {{ s.icon }}"></i></div>
          <div class="stat-body">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Courses -->
    <section class="section">
      <div class="section-container">
        <div class="section-head">
          <div>
            <h2 class="section-title">Featured Courses</h2>
            <p class="section-subtitle">Handpicked courses to kickstart your journey</p>
          </div>
          <a routerLink="/courses" class="btn btn-outline">Browse All <i class="fas fa-arrow-right"></i></a>
        </div>

        <div class="courses-grid" *ngIf="!loadingCourses && featuredCourses.length > 0">
          <app-course-card *ngFor="let c of featuredCourses" [course]="c" />
        </div>
        <div class="courses-grid" *ngIf="loadingCourses">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
        </div>
        <div class="empty-fallback" *ngIf="!loadingCourses && featuredCourses.length === 0">
          <p>No courses available right now. <a routerLink="/register">Create an account</a> to get started.</p>
        </div>
      </div>
    </section>

    <!-- Why Learnova -->
    <section class="section section-gray">
      <div class="section-container">
        <div class="section-head-center">
          <h2 class="section-title">Why Choose Learnova?</h2>
          <p class="section-subtitle">Everything you need to learn and grow in one place</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features; let i = index"
               [class]="'fade-in fade-in-delay-' + (i % 4 + 1)">
            <div class="feature-icon" [style.color]="f.color" [style.background]="f.bg">
              <i class="fas {{ f.icon }}"></i>
            </div>
            <h3 class="feature-title">{{ f.title }}</h3>
            <p class="feature-desc">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="section-container">
        <div class="section-head-center">
          <h2 class="section-title">Popular Categories</h2>
          <p class="section-subtitle">Explore our most sought-after learning categories</p>
        </div>
        <div class="categories-grid">
          <a *ngFor="let cat of categories" [routerLink]="['/courses']"
             [queryParams]="{category: cat.name}" class="category-card">
            <div class="cat-icon" [style.background]="cat.bg" [style.color]="cat.color">
              <i class="fas {{ cat.icon }}"></i>
            </div>
            <div class="cat-name">{{ cat.name }}</div>
            <div class="cat-count">{{ cat.count }} courses</div>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Learning?</h2>
          <p class="cta-subtitle">Join 50,000+ learners who are already building their future with Learnova.</p>
          <div class="cta-actions">
            <a routerLink="/register" class="btn btn-primary btn-lg">
              <i class="fas fa-user-plus"></i> Create Free Account
            </a>
            <a routerLink="/courses" class="btn btn-outline-white btn-lg">
              <i class="fas fa-compass"></i> Explore Courses
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* ── Hero ── */
    .hero {
      background: linear-gradient(160deg, var(--primary-subtle) 0%, var(--white) 60%);
      padding: 80px 0 60px;
      overflow: hidden;
    }
    .hero-container {
      max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--primary-light); color: var(--primary);
      font-size: 0.8rem; font-weight: 700; letter-spacing: 0.04em;
      padding: 6px 14px; border-radius: var(--radius-full);
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.4rem); font-weight: 800;
      line-height: 1.1; color: var(--gray-900); margin-bottom: 20px;
    }
    .hero-highlight {
      background: linear-gradient(135deg, var(--primary), #4d9dff);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.05rem; color: var(--gray-600); line-height: 1.7; margin-bottom: 32px; max-width: 480px;
    }
    .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
    .hero-trust { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
    .trust-item { text-align: center; }
    .trust-num { display: block; font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; color: var(--gray-900); }
    .trust-label { font-size: 0.78rem; color: var(--gray-500); }
    .trust-divider { width: 1px; height: 36px; background: var(--gray-200); }

    /* Hero Visual */
    .hero-visual { display: flex; align-items: center; justify-content: center; }
    .hero-card-stack { position: relative; width: 380px; height: 380px; }
    .hero-main-visual {
      position: absolute; inset: 40px;
      display: flex; align-items: center; justify-content: center;
    }
    .visual-blob {
      position: absolute; inset: 0; border-radius: 60% 40% 50% 60% / 50% 60% 40% 50%;
      background: linear-gradient(135deg, var(--primary-light), var(--primary-subtle));
    }
    .visual-icon-wrap {
      position: relative; font-size: 5rem; color: var(--primary); opacity: 0.85;
    }
    .floating-card {
      position: absolute; background: var(--white);
      border: 1px solid var(--gray-200); border-radius: var(--radius-lg);
      padding: 12px 16px; display: flex; align-items: center; gap: 10px;
      box-shadow: var(--shadow-md); z-index: 2; min-width: 180px;
      font-size: 0.85rem;
    }
    .floating-card i { font-size: 1.3rem; color: var(--primary); flex-shrink: 0; }
    .fc-title { font-weight: 600; color: var(--gray-800); font-size: 0.85rem; }
    .fc-sub { font-size: 0.72rem; color: var(--gray-500); margin-top: 2px; }
    .fc1 { top: 20px; left: -10px; animation: floatY 3s ease-in-out infinite; }
    .fc2 { bottom: 60px; left: -20px; animation: floatY 3.5s ease-in-out infinite 0.5s; }
    .fc3 { top: 30px; right: -20px; animation: floatY 4s ease-in-out infinite 1s; }
    @keyframes floatY {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }

    /* ── Stats Bar ── */
    .stats-bar { background: var(--white); border-top: 1px solid var(--gray-200); border-bottom: 1px solid var(--gray-200); padding: 28px 0; }
    .stats-bar-container {
      max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
    }
    .stat-item {
      display: flex; align-items: center; gap: 16px; padding: 0 32px;
      border-right: 1px solid var(--gray-200);
    }
    .stat-item:first-child { padding-left: 0; }
    .stat-item:last-child { border-right: none; }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;
    }
    .stat-value { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--gray-900); }
    .stat-label { font-size: 0.82rem; color: var(--gray-500); }

    /* ── Sections ── */
    .section { padding: 80px 0; }
    .section-gray { background: var(--gray-50); }
    .section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .section-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 40px;
    }
    .section-head-center { text-align: center; margin-bottom: 48px; }
    .section-head-center .section-subtitle { max-width: 520px; margin: 0 auto; }
    .section-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 6px; }
    .section-subtitle { color: var(--gray-500); font-size: 0.95rem; }

    /* Courses Grid */
    .courses-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    }
    .skeleton-card {
      height: 320px; border-radius: var(--radius-lg);
      background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-50) 50%, var(--gray-100) 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
    }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .empty-fallback { text-align: center; padding: 40px; color: var(--gray-500); }

    /* Features */
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .feature-card {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 28px;
      transition: var(--transition);
    }
    .feature-card:hover { box-shadow: var(--shadow); transform: translateY(-3px); }
    .feature-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; margin-bottom: 16px;
    }
    .feature-title { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
    .feature-desc { font-size: 0.875rem; color: var(--gray-500); line-height: 1.6; }

    /* Categories */
    .categories-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
    .category-card {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); padding: 20px 12px;
      text-align: center; transition: var(--transition); cursor: pointer;
      text-decoration: none;
    }
    .category-card:hover { border-color: var(--primary); box-shadow: var(--shadow); transform: translateY(-2px); }
    .cat-icon {
      width: 52px; height: 52px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem; margin: 0 auto 10px;
    }
    .cat-name { font-size: 0.875rem; font-weight: 600; color: var(--gray-800); margin-bottom: 2px; }
    .cat-count { font-size: 0.72rem; color: var(--gray-500); }

    /* CTA */
    .cta-section {
      background: linear-gradient(135deg, #0f4fd1, #1a6bff);
      padding: 80px 0;
    }
    .cta-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .cta-content { text-align: center; }
    .cta-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
    .cta-subtitle { font-size: 1rem; color: rgba(255,255,255,0.8); margin-bottom: 36px; }
    .cta-actions { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
    .btn-outline-white {
      background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5);
      border-radius: var(--radius); padding: 12px 24px;
      display: inline-flex; align-items: center; gap: 8px;
      font-family: var(--font-display); font-size: 1rem; font-weight: 500;
      cursor: pointer; text-decoration: none; transition: var(--transition);
    }
    .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,0.1); color: #fff; }

    @media (max-width: 1100px) {
      .courses-grid { grid-template-columns: repeat(3, 1fr); }
      .categories-grid { grid-template-columns: repeat(4, 1fr); }
    }
    @media (max-width: 900px) {
      .hero-container { grid-template-columns: 1fr; gap: 40px; }
      .hero-visual { display: none; }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-bar-container { grid-template-columns: repeat(2, 1fr); }
      .stat-item { border: none; border-bottom: 1px solid var(--gray-200); }
      .courses-grid { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 600px) {
      .courses-grid { grid-template-columns: 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .stats-bar-container { grid-template-columns: 1fr; }
      .section-head { flex-direction: column; align-items: flex-start; gap: 12px; }
    }
  `]
})
export class LandingComponent implements OnInit {
  featuredCourses: Course[] = [];
  loadingCourses = true;

  stats = [
    { icon: 'fa-users', value: '50,000+', label: 'Active Students' },
    { icon: 'fa-book-open', value: '500+',   label: 'Expert Courses' },
    { icon: 'fa-chalkboard-teacher', value: '120+', label: 'Instructors' },
    { icon: 'fa-certificate', value: '98%',  label: 'Satisfaction Rate' }
  ];

  features = [
    { icon: 'fa-play-circle',  title: 'On-Demand Video',   desc: 'Access course videos anytime, anywhere on any device at your own pace.', color: '#1a6bff', bg: '#e8f0ff' },
    { icon: 'fa-certificate',  title: 'Earn Certificates', desc: 'Complete courses and earn verifiable certificates to boost your career.', color: '#10b981', bg: '#d1fae5' },
    { icon: 'fa-comments',     title: 'Live Discussions',  desc: 'Engage with instructors and peers in threaded discussion forums.', color: '#f59e0b', bg: '#fef3c7' },
    { icon: 'fa-chart-line',   title: 'Track Progress',    desc: 'Monitor your learning journey with detailed progress tracking.', color: '#06b6d4', bg: '#cffafe' },
    { icon: 'fa-mobile-alt',   title: 'Mobile Ready',      desc: 'Fully responsive design so you can learn on phones and tablets too.', color: '#8b5cf6', bg: '#ede9fe' },
    { icon: 'fa-shield-alt',   title: 'Secure Platform',   desc: 'JWT-secured platform with role-based access for all user types.', color: '#ef4444', bg: '#fee2e2' }
  ];

  categories = [
    { icon: 'fa-code',           name: 'Development',  count: 120, bg: '#e8f0ff', color: '#1a6bff' },
    { icon: 'fa-chart-bar',      name: 'Business',     count: 85,  bg: '#fef3c7', color: '#f59e0b' },
    { icon: 'fa-paint-brush',    name: 'Design',       count: 64,  bg: '#ede9fe', color: '#8b5cf6' },
    { icon: 'fa-database',       name: 'Data Science', count: 48,  bg: '#cffafe', color: '#06b6d4' },
    { icon: 'fa-cloud',          name: 'Cloud & DevOps',count:38,  bg: '#d1fae5', color: '#10b981' },
    { icon: 'fa-shield-alt',     name: 'Security',     count: 32,  bg: '#fee2e2', color: '#ef4444' }
  ];

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getFeaturedCourses().subscribe({
      next: courses => { this.featuredCourses = courses.slice(0, 4); this.loadingCourses = false; },
      error: () => { this.loadingCourses = false; }
    });
  }
}
