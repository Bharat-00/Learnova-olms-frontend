import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { ProgressService } from '../../../core/services/progress.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Enrollment, CourseProgress } from '../../../core/models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Welcome back, {{ firstName }}! 👋</h1>
          <p class="page-subtitle">Here's what's happening with your learning today.</p>
        </div>
        <a routerLink="/courses" class="btn btn-primary">
          <i class="fas fa-compass"></i> Explore Courses
        </a>
      </div>

      <!-- Stats -->
      <div class="stats-grid fade-in fade-in-delay-1">
        <app-stats-card label="Enrolled Courses" [value]="enrollments.length"
          icon="fa-book-open" color="var(--primary)" />
        <app-stats-card label="Completed Courses" [value]="completedCount"
          icon="fa-check-circle" color="var(--success)" />
        <app-stats-card label="Certificates Earned" [value]="completedCount"
          icon="fa-certificate" color="var(--warning)" />
        <app-stats-card label="Notifications" [value]="unreadNotif"
          icon="fa-bell" color="var(--info)" />
      </div>

      <div class="dash-grid">
        <!-- Continue Learning -->
        <div class="card fade-in fade-in-delay-2">
          <div class="card-head">
            <h3>Continue Learning</h3>
            <a routerLink="/student/courses" class="view-all">View All</a>
          </div>
          <app-loading-spinner *ngIf="loading" />
          <div class="continue-list" *ngIf="!loading && enrollments.length > 0">
            <div class="continue-item" *ngFor="let e of enrollments.slice(0,4)">
              <div class="ci-thumb">
                <i class="fas fa-book-open"></i>
              </div>
              <div class="ci-info">
                <div class="ci-title">{{ e.courseName || 'Course #' + e.courseId }}</div>
                <div class="progress-bar-container" style="margin-top:6px">
                  <div class="progress-bar-fill" [style.width]="(e.completionPercent || 0) + '%'"></div>
                </div>
                <div class="ci-progress-label">{{ e.completionPercent || 0 }}% complete</div>
              </div>
              <a [routerLink]="['/student/courses']" class="btn btn-outline btn-sm">
                <i class="fas fa-play"></i> Resume
              </a>
            </div>
          </div>
          <app-empty-state *ngIf="!loading && enrollments.length === 0"
            icon="fa-book-open" title="No courses yet"
            message="Browse the catalog and enroll in your first course."
            actionLabel="Browse Courses" (action)="goToCatalog()" />
        </div>

        <!-- Progress Overview -->
        <div class="card fade-in fade-in-delay-3">
          <div class="card-head">
            <h3>Progress Overview</h3>
            <a routerLink="/student/progress" class="view-all">Details</a>
          </div>
          <div class="progress-list" *ngIf="progressData.length > 0">
            <div class="progress-item" *ngFor="let p of progressData.slice(0,4)">
              <div class="progress-course-name">{{ p.courseTitle || 'Course #' + p.courseId }}</div>
              <div class="progress-numbers">{{ p.completedLessons }} / {{ p.totalLessons }} lessons</div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" [style.width]="p.percentage + '%'"></div>
              </div>
              <div class="progress-pct">{{ p.percentage }}%</div>
            </div>
          </div>
          <app-empty-state *ngIf="progressData.length === 0 && !loading"
            icon="fa-chart-line" title="No progress yet"
            message="Start watching lessons to track your progress." />
        </div>
      </div>

      <!-- Recent Notifications -->
      <div class="card fade-in fade-in-delay-4" style="margin-top:20px">
        <div class="card-head">
          <h3>Recent Notifications</h3>
          <a routerLink="/student/notifications" class="view-all">View All</a>
        </div>
        <div class="notif-items" *ngIf="recentNotifs.length > 0">
          <div class="notif-row" *ngFor="let n of recentNotifs">
            <div class="notif-type-icon" [ngClass]="n.type.toLowerCase()">
              <i class="fas fa-bell"></i>
            </div>
            <div class="notif-text">
              <div class="notif-row-title">{{ n.title }}</div>
              <div class="notif-row-msg">{{ n.message }}</div>
            </div>
            <div class="notif-time">{{ n.createdAt | date:'shortDate' }}</div>
          </div>
        </div>
        <app-empty-state *ngIf="recentNotifs.length === 0 && !loading"
          icon="fa-bell-slash" title="No notifications" message="You're all caught up!" />
      </div>
    </div>
  `,
  styles: [`
    .dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-head h3 { font-size: 1rem; font-weight: 600; }
    .view-all { font-size: 0.82rem; color: var(--primary); font-weight: 500; }
    .continue-list { display: flex; flex-direction: column; gap: 16px; }
    .continue-item { display: flex; align-items: center; gap: 14px; }
    .ci-thumb {
      width: 44px; height: 44px; border-radius: var(--radius);
      background: var(--primary-light); color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; flex-shrink: 0;
    }
    .ci-info { flex: 1; min-width: 0; }
    .ci-title { font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ci-progress-label { font-size: 0.72rem; color: var(--gray-400); margin-top: 4px; }
    .progress-list { display: flex; flex-direction: column; gap: 16px; }
    .progress-item {}
    .progress-course-name { font-size: 0.875rem; font-weight: 500; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .progress-numbers { font-size: 0.75rem; color: var(--gray-400); margin-bottom: 4px; }
    .progress-pct { font-size: 0.78rem; font-weight: 600; color: var(--primary); margin-top: 4px; text-align: right; }
    .notif-items { display: flex; flex-direction: column; }
    .notif-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--gray-100); }
    .notif-row:last-child { border-bottom: none; }
    .notif-type-icon {
      width: 36px; height: 36px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; font-size: 0.875rem;
    }
    .notif-type-icon.info { background: var(--primary-light); color: var(--primary); }
    .notif-type-icon.success { background: var(--success-light); color: var(--success); }
    .notif-type-icon.warning { background: var(--warning-light); color: var(--warning); }
    .notif-type-icon.announcement { background: var(--info-light); color: var(--info); }
    .notif-text { flex: 1; min-width: 0; }
    .notif-row-title { font-size: 0.875rem; font-weight: 500; }
    .notif-row-msg { font-size: 0.78rem; color: var(--gray-500); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .notif-time { font-size: 0.72rem; color: var(--gray-400); flex-shrink: 0; }
    @media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
  `]
})
export class StudentDashboardComponent implements OnInit {
  firstName = '';
  enrollments: Enrollment[] = [];
  progressData: CourseProgress[] = [];
  recentNotifs: any[] = [];
  loading = true;
  completedCount = 0;
  unreadNotif = 0;

  constructor(
    private authService: AuthService,
    private enrollmentService: EnrollmentService,
    private progressService: ProgressService,
    private notifService: NotificationService,
    // router removed
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.firstName = user?.firstName || 'Student';
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.enrollmentService.getMyEnrollments().subscribe({
      next: data => {
        this.enrollments = data;
        this.completedCount = data.filter(e => e.status === 'COMPLETED').length;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.progressService.getAllMyProgress().subscribe({
      next: data => this.progressData = data,
      error: () => {}
    });

    this.notifService.getMyNotifications(0, 5).subscribe({
      next: res => this.recentNotifs = res.content || [],
      error: () => {}
    });

    this.notifService.getUnreadCount().subscribe({
      next: res => this.unreadNotif = res.count,
      error: () => {}
    });
  }

  goToCatalog() {
    window.location.href = '/courses';
  }
}
