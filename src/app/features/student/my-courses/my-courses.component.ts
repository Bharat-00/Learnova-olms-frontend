import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { LessonService } from '../../../core/services/lesson.service';
import { Enrollment } from '../../../core/models';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Courses</h1>
          <p class="page-subtitle">All your enrolled courses in one place</p>
        </div>
        <a routerLink="/courses" class="btn btn-primary">
          <i class="fas fa-plus"></i> Enroll More
        </a>
      </div>

      <div class="filter-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'all'"    (click)="setTab('all')">All ({{ enrollments.length }})</button>
        <button class="tab-btn" [class.active]="activeTab === 'active'" (click)="setTab('active')">Active</button>
        <button class="tab-btn" [class.active]="activeTab === 'completed'" (click)="setTab('completed')">Completed</button>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="my-courses-grid" *ngIf="!loading && filtered.length > 0">
        <div class="my-course-card card" *ngFor="let e of filtered">
          <div class="mcc-thumb">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="mcc-body">
            <div class="mcc-status badge" [ngClass]="statusClass(e.status)">{{ e.status }}</div>
            <h3 class="mcc-title">{{ e.courseName || 'Course #' + e.courseId }}</h3>
            <div class="mcc-enrolled">
              <i class="fas fa-calendar"></i> Enrolled {{ e.enrolledAt | date:'mediumDate' }}
            </div>
            <div class="mcc-progress">
              <div class="progress-bar-container">
                <div class="progress-bar-fill" [style.width]="(e.completionPercent || 0) + '%'"></div>
              </div>
              <span class="progress-pct">{{ e.completionPercent || 0 }}%</span>
            </div>
          </div>
          <div class="mcc-actions">
            <a [routerLink]="['/student/lesson', e.courseId]" class="btn btn-primary btn-sm">
              <i class="fas fa-play"></i> Continue
            </a>
            <a [routerLink]="['/student/progress']" class="btn btn-secondary btn-sm">
              <i class="fas fa-chart-line"></i> Progress
            </a>
          </div>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && filtered.length === 0"
        icon="fa-book-open"
        title="No courses found"
        message="You haven't enrolled in any courses yet. Browse the catalog to get started."
        actionLabel="Browse Courses"
        (action)="goToCatalog()" />
    </div>
  `,
  styles: [`
    .filter-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
    .tab-btn {
      padding: 8px 18px; border-radius: var(--radius-full);
      border: 1.5px solid var(--gray-200); background: var(--white);
      font-size: 0.875rem; font-weight: 500; cursor: pointer; color: var(--gray-600);
      transition: var(--transition);
    }
    .tab-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .my-courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .my-course-card { display: flex; flex-direction: column; gap: 14px; }
    .mcc-thumb {
      height: 120px; border-radius: var(--radius);
      background: linear-gradient(135deg, var(--primary-light), var(--primary-subtle));
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; color: var(--primary);
    }
    .mcc-body { flex: 1; }
    .mcc-status { margin-bottom: 8px; }
    .mcc-title { font-size: 1rem; font-weight: 600; margin-bottom: 8px; }
    .mcc-enrolled { font-size: 0.78rem; color: var(--gray-400); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
    .mcc-progress { display: flex; align-items: center; gap: 10px; }
    .mcc-progress .progress-bar-container { flex: 1; }
    .progress-pct { font-size: 0.78rem; font-weight: 600; color: var(--primary); white-space: nowrap; }
    .mcc-actions { display: flex; gap: 8px; }
    .badge-success { background: var(--success-light); color: #059669; }
    .badge-warning { background: var(--warning-light); color: #d97706; }
    .badge-gray    { background: var(--gray-100); color: var(--gray-600); }
  `]
})
export class MyCoursesComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = true;
  activeTab = 'all';

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit() {
    this.enrollmentService.getMyEnrollments().subscribe({
      next: data => { this.enrollments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Enrollment[] {
    if (this.activeTab === 'active')    return this.enrollments.filter(e => e.status === 'ACTIVE');
    if (this.activeTab === 'completed') return this.enrollments.filter(e => e.status === 'COMPLETED');
    return this.enrollments;
  }

  setTab(tab: string) { this.activeTab = tab; }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'badge badge-success', COMPLETED: 'badge badge-primary', CANCELLED: 'badge badge-gray'
    };
    return map[status] || 'badge badge-gray';
  }

  goToCatalog() { window.location.href = '/courses'; }
}
