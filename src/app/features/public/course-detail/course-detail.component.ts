import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CourseService } from '../../../core/services/course.service';
import { LessonService } from '../../../core/services/lesson.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course, Lesson } from '../../../core/models';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div *ngIf="loading"><app-loading-spinner text="Loading course..." /></div>

    <div *ngIf="!loading && !course" class="not-found">
      <div class="section-container">
        <h2>Course not found</h2>
        <p>This course may have been removed or is unavailable.</p>
        <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
      </div>
    </div>

    <div *ngIf="!loading && course">
      <!-- Course Header -->
      <div class="course-header">
        <div class="course-header-container">
          <div class="course-header-content">
            <div class="course-breadcrumb">
              <a routerLink="/courses">Courses</a>
              <i class="fas fa-chevron-right"></i>
              <span>{{ course.category }}</span>
            </div>
            <h1 class="course-heading">{{ course.title }}</h1>
            <p class="course-header-desc">{{ course.shortDescription || course.description }}</p>
            <div class="course-header-meta">
              <span class="badge" [ngClass]="levelClass">{{ course.level }}</span>
              <span *ngIf="course.language"><i class="fas fa-globe"></i> {{ course.language }}</span>
              <span *ngIf="course.totalLessons"><i class="fas fa-play-circle"></i> {{ course.totalLessons }} lessons</span>
              <span *ngIf="course.duration"><i class="fas fa-clock"></i> {{ course.duration }}h total</span>
              <span *ngIf="course.totalEnrollments"><i class="fas fa-users"></i> {{ course.totalEnrollments }} enrolled</span>
            </div>
            <div class="course-instructor-info" *ngIf="course.instructorName">
              <div class="avatar avatar-sm">{{ course.instructorName[0] }}</div>
              <span>By <strong>{{ course.instructorName }}</strong></span>
            </div>
          </div>

          <!-- Enrollment Card -->
          <div class="enroll-card">
            <div class="course-thumbnail">
              <img *ngIf="course.thumbnailUrl" [src]="course.thumbnailUrl" [alt]="course.title">
              <div *ngIf="!course.thumbnailUrl" class="thumb-placeholder-lg">
                <i class="fas fa-play-circle"></i>
              </div>
            </div>
            <div class="enroll-card-body">
              <div class="enroll-price">
                <span *ngIf="course.isFree" class="price-free">FREE</span>
                <span *ngIf="!course.isFree" class="price-amount">{{ course.price | number:'1.2-2' }}</span>
              </div>
              <div class="enroll-actions">
                <button *ngIf="!isEnrolled && !isLoggedIn" class="btn btn-primary btn-block" (click)="goToLogin()">
                  <i class="fas fa-sign-in-alt"></i> Login to Enroll
                </button>
                <button *ngIf="!isEnrolled && isLoggedIn && course.isFree"
                        class="btn btn-primary btn-block" (click)="enroll()" [disabled]="enrolling">
                  <span *ngIf="enrolling" class="spinner-sm"></span>
                  <span *ngIf="!enrolling"><i class="fas fa-user-plus"></i> Enroll Now — Free</span>
                </button>
                <button *ngIf="!isEnrolled && isLoggedIn && !course.isFree"
                        class="btn btn-primary btn-block" (click)="buyNow()" [disabled]="enrolling">
                  <i class="fas fa-shopping-cart"></i> Buy Now
                </button>
                <a *ngIf="isEnrolled" [routerLink]="['/student/courses']" class="btn btn-success btn-block">
                  <i class="fas fa-play"></i> Go to Course
                </a>
              </div>
              <div class="alert alert-success mt-2" *ngIf="enrollSuccess">
                <i class="fas fa-check-circle"></i> Successfully enrolled!
              </div>
              <div class="alert alert-danger mt-2" *ngIf="enrollError">
                <i class="fas fa-exclamation-circle"></i> {{ enrollError }}
              </div>
              <ul class="enroll-features">
                <li><i class="fas fa-infinity"></i> Full lifetime access</li>
                <li><i class="fas fa-mobile-alt"></i> Access on mobile & desktop</li>
                <li><i class="fas fa-certificate"></i> Certificate of completion</li>
                <li><i class="fas fa-comments"></i> Community discussions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Body -->
      <div class="course-body-container">
        <div class="course-details">
          <!-- About -->
          <section class="detail-section card">
            <h2>About This Course</h2>
            <p class="course-full-desc">{{ course.description }}</p>
          </section>

          <!-- Lessons Preview -->
          <section class="detail-section card">
            <h2>Course Curriculum</h2>
            <p class="lessons-count">{{ lessons.length }} lessons</p>
            <div class="lesson-list">
              <div class="lesson-item" *ngFor="let lesson of lessons; let i = index">
                <div class="lesson-index">{{ i + 1 }}</div>
                <div class="lesson-info">
                  <div class="lesson-title">{{ lesson.title }}</div>
                  <div class="lesson-meta">
                    <span><i class="fas fa-play-circle"></i> {{ lesson.type }}</span>
                    <span *ngIf="lesson.duration"><i class="fas fa-clock"></i> {{ lesson.duration }} min</span>
                  </div>
                </div>
                <div class="lesson-access">
                  <span *ngIf="lesson.isFree" class="badge badge-success">Free Preview</span>
                  <i *ngIf="!lesson.isFree" class="fas fa-lock lesson-lock"></i>
                </div>
              </div>
            </div>
            <div class="lesson-empty" *ngIf="lessons.length === 0">
              <p>Curriculum details will be added soon.</p>
            </div>
          </section>

          <!-- Reviews Placeholder -->
          <section class="detail-section card">
            <h2>Student Reviews</h2>
            <div class="reviews-placeholder">
              <div class="review-score">
                <div class="big-score">{{ course.rating || '4.7' }}</div>
                <div class="stars">
                  <i class="fas fa-star" *ngFor="let s of [1,2,3,4,5]"></i>
                </div>
                <div class="score-label">Course Rating</div>
              </div>
              <p class="reviews-note">Reviews will appear after you enroll and complete the course.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-header {
      background: linear-gradient(145deg, #0a3ab5, #1a6bff);
      padding: 48px 0;
    }
    .course-header-container {
      max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: grid; grid-template-columns: 1fr 360px; gap: 40px; align-items: start;
    }
    .course-breadcrumb {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.82rem; color: rgba(255,255,255,0.7); margin-bottom: 16px;
    }
    .course-breadcrumb a { color: rgba(255,255,255,0.7); }
    .course-breadcrumb a:hover { color: #fff; }
    .course-breadcrumb i { font-size: 0.65rem; }
    .course-heading { font-size: 2rem; font-weight: 700; color: #fff; margin-bottom: 12px; line-height: 1.25; }
    .course-header-desc { color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.7; margin-bottom: 16px; }
    .course-header-meta { display: flex; flex-wrap: wrap; gap: 14px; font-size: 0.85rem; color: rgba(255,255,255,0.8); margin-bottom: 16px; }
    .course-header-meta span { display: flex; align-items: center; gap: 5px; }
    .course-instructor-info { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.85); font-size: 0.9rem; }

    .enroll-card {
      background: var(--white); border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg); overflow: hidden;
      position: sticky; top: 80px;
    }
    .course-thumbnail { height: 200px; overflow: hidden; }
    .course-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
    .thumb-placeholder-lg {
      width: 100%; height: 100%;
      background: var(--primary-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem; color: var(--primary);
    }
    .enroll-card-body { padding: 24px; }
    .enroll-price { margin-bottom: 16px; }
    .price-free { font-size: 1.8rem; font-weight: 800; color: var(--success); font-family: var(--font-display); }
    .price-amount { font-size: 1.8rem; font-weight: 800; color: var(--gray-900); font-family: var(--font-display); }
    .enroll-actions { margin-bottom: 16px; }
    .btn-block { width: 100%; justify-content: center; padding: 13px; font-size: 0.95rem; margin-bottom: 8px; }
    .spinner-sm { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .enroll-features { list-style: none; display: flex; flex-direction: column; gap: 10px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
    .enroll-features li { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--gray-600); }
    .enroll-features i { color: var(--success); width: 16px; }

    .course-body-container { max-width: 900px; margin: 0 auto; padding: 32px 24px; }
    .detail-section { margin-bottom: 24px; }
    .detail-section h2 { font-size: 1.2rem; font-weight: 700; margin-bottom: 16px; }
    .course-full-desc { font-size: 0.95rem; color: var(--gray-600); line-height: 1.8; }
    .lessons-count { font-size: 0.85rem; color: var(--gray-500); margin-bottom: 16px; }
    .lesson-list { display: flex; flex-direction: column; gap: 8px; }
    .lesson-item {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 16px; border: 1px solid var(--gray-200);
      border-radius: var(--radius); background: var(--gray-50);
    }
    .lesson-index {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .lesson-info { flex: 1; }
    .lesson-title { font-size: 0.9rem; font-weight: 500; color: var(--gray-800); }
    .lesson-meta { display: flex; gap: 12px; font-size: 0.75rem; color: var(--gray-400); margin-top: 3px; }
    .lesson-meta span { display: flex; align-items: center; gap: 4px; }
    .lesson-lock { color: var(--gray-300); }
    .lesson-empty { text-align: center; padding: 24px; color: var(--gray-400); }

    .reviews-placeholder { display: flex; align-items: center; gap: 32px; }
    .big-score { font-family: var(--font-display); font-size: 3rem; font-weight: 800; color: var(--gray-900); }
    .stars { color: var(--warning); font-size: 1.1rem; margin: 4px 0; }
    .score-label { font-size: 0.8rem; color: var(--gray-500); }
    .reviews-note { font-size: 0.875rem; color: var(--gray-500); }

    .not-found { max-width: 1200px; margin: 0 auto; padding: 60px 24px; text-align: center; }

    .badge-primary { background: var(--primary-light); color: var(--primary); }
    .badge-success { background: var(--success-light); color: #059669; }
    .badge-warning { background: var(--warning-light); color: #d97706; }
    .mt-2 { margin-top: 8px; }

    @media (max-width: 900px) {
      .course-header-container { grid-template-columns: 1fr; }
      .enroll-card { position: static; }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  lessons: Lesson[] = [];
  loading = true;
  isEnrolled = false;
  isLoggedIn = false;
  enrolling = false;
  enrollSuccess = false;
  enrollError = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private lessonService: LessonService,
    private enrollmentService: EnrollmentService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourseById(id).subscribe({
      next: course => {
        this.course = course;
        this.loading = false;
        this.loadLessons(course.id);
        if (this.isLoggedIn) this.checkEnrollment(course.id);
      },
      error: () => { this.loading = false; }
    });
  }

  loadLessons(courseId: number) {
    this.lessonService.getLessonsByCourse(courseId).subscribe({
      next: lessons => this.lessons = lessons,
      error: () => {}
    });
  }

  checkEnrollment(courseId: number) {
    this.enrollmentService.isEnrolled(courseId).subscribe({
      next: val => this.isEnrolled = val,
      error: () => {}
    });
  }

  enroll() {
    if (!this.course) return;
    this.enrolling = true;
    this.enrollmentService.enrollInCourse(this.course.id).subscribe({
      next: () => { this.isEnrolled = true; this.enrollSuccess = true; this.enrolling = false; },
      error: err => { this.enrollError = err.userMessage || 'Enrollment failed.'; this.enrolling = false; }
    });
  }

  buyNow() {
    if (!this.course) return;
    this.paymentService.initiateCoursePayment(this.course.id).subscribe({
      next: () => { this.router.navigate(['/student/payments']); },
      error: err => { this.enrollError = err.userMessage || 'Payment initiation failed.'; }
    });
  }

  goToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }

  get levelClass(): string {
    const map: Record<string, string> = { BEGINNER: 'badge badge-success', INTERMEDIATE: 'badge badge-warning', ADVANCED: 'badge badge-danger' };
    return map[this.course?.level || ''] || 'badge badge-gray';
  }
}
