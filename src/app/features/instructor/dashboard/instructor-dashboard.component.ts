import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent, EmptyStateComponent, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Instructor Dashboard</h1>
          <p class="page-subtitle">Welcome back, {{ firstName }}. Here's an overview of your courses.</p>
        </div>
        <a routerLink="/instructor/courses/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Create Course
        </a>
      </div>

      <div class="stats-grid fade-in-delay-1">
        <app-stats-card label="Total Courses"     [value]="courses.length"        icon="fa-book"        color="var(--primary)" />
        <app-stats-card label="Published"         [value]="publishedCount"         icon="fa-globe"       color="var(--success)" />
        <app-stats-card label="Total Students"    [value]="totalStudents"          icon="fa-users"       color="var(--warning)" />
        <app-stats-card label="Pending Approval"  [value]="pendingCount"           icon="fa-clock"       color="var(--info)" />
      </div>

      <div class="dash-grid fade-in-delay-2">
        <!-- My Courses -->
        <div class="card">
          <div class="card-head">
            <h3>My Courses</h3>
            <a routerLink="/instructor/courses" class="view-all">View All</a>
          </div>
          <app-loading-spinner *ngIf="loading" />
          <div class="course-table" *ngIf="!loading && courses.length > 0">
            <div class="ct-row" *ngFor="let c of courses.slice(0,5)">
              <div class="ct-icon"><i class="fas fa-book-open"></i></div>
              <div class="ct-info">
                <div class="ct-title">{{ c.title }}</div>
                <div class="ct-meta">{{ c.totalEnrollments || 0 }} students &bull; {{ c.totalLessons || 0 }} lessons</div>
              </div>
              <div class="ct-badges">
                <span class="badge" [ngClass]="c.published ? 'badge-success' : 'badge-gray'">
                  {{ c.published ? 'Published' : 'Draft' }}
                </span>
                <span class="badge badge-warning" *ngIf="!c.approved">Pending</span>
              </div>
              <div class="ct-actions">
                <a [routerLink]="['/instructor/courses/edit', c.id]" class="btn btn-secondary btn-sm">
                  <i class="fas fa-edit"></i>
                </a>
              </div>
            </div>
          </div>
          <app-empty-state *ngIf="!loading && courses.length === 0"
            icon="fa-book" title="No courses yet" message="Create your first course to get started."
            actionLabel="Create Course" (action)="goCreate()" />
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="card-head-title">Quick Actions</h3>
          <div class="quick-actions-grid">
            <a routerLink="/instructor/courses/create" class="qa-card">
              <div class="qa-icon" style="background:var(--primary-light);color:var(--primary)"><i class="fas fa-plus-circle"></i></div>
              <div class="qa-label">Create Course</div>
            </a>
            <a routerLink="/instructor/students" class="qa-card">
              <div class="qa-icon" style="background:var(--success-light);color:var(--success)"><i class="fas fa-users"></i></div>
              <div class="qa-label">View Students</div>
            </a>
            <a routerLink="/instructor/analytics" class="qa-card">
              <div class="qa-icon" style="background:var(--warning-light);color:var(--warning)"><i class="fas fa-chart-bar"></i></div>
              <div class="qa-label">Analytics</div>
            </a>
            <a routerLink="/instructor/discussions" class="qa-card">
              <div class="qa-icon" style="background:var(--info-light);color:var(--info)"><i class="fas fa-comments"></i></div>
              <div class="qa-label">Discussions</div>
            </a>
          </div>

          <div class="tip-box">
            <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
            <div>
              <div class="tip-title">Instructor Tip</div>
              <div class="tip-text">Courses with video previews get 3x more enrollments. Add a trailer lesson to boost visibility.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dash-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .card-head-title { font-size: 1rem; font-weight: 600; margin-bottom: 20px; }
    .view-all { font-size: 0.82rem; color: var(--primary); font-weight: 500; }
    .course-table { display: flex; flex-direction: column; gap: 12px; }
    .ct-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--gray-100); }
    .ct-row:last-child { border-bottom: none; }
    .ct-icon { width: 40px; height: 40px; border-radius: var(--radius); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ct-info { flex: 1; min-width: 0; }
    .ct-title { font-size: 0.875rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ct-meta { font-size: 0.75rem; color: var(--gray-400); margin-top: 2px; }
    .ct-badges { display: flex; gap: 4px; flex-shrink: 0; }
    .ct-actions { flex-shrink: 0; }
    .quick-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .qa-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius-lg); text-decoration: none; transition: var(--transition); }
    .qa-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow); }
    .qa-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .qa-label { font-size: 0.8rem; font-weight: 600; color: var(--gray-700); }
    .tip-box { display: flex; gap: 12px; background: var(--warning-light); border-radius: var(--radius); padding: 14px; }
    .tip-icon { color: var(--warning); font-size: 1.1rem; flex-shrink: 0; margin-top: 2px; }
    .tip-title { font-size: 0.8rem; font-weight: 700; color: #92400e; margin-bottom: 4px; }
    .tip-text { font-size: 0.8rem; color: #92400e; line-height: 1.5; }
    @media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }
  `]
})
export class InstructorDashboardComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  firstName = '';
  totalStudents = 0;

  constructor(private authService: AuthService, private courseService: CourseService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    this.firstName = user?.firstName || 'Instructor';
    if (user) {
      this.courseService.getCoursesByInstructor(user.id).subscribe({
        next: data => { this.courses = data; this.loading = false; this.totalStudents = data.reduce((s, c) => s + (c.totalEnrollments || 0), 0); },
        error: () => { this.loading = false; }
      });
    }
  }

  get publishedCount() { return this.courses.filter(c => c.published).length; }
  get pendingCount()   { return this.courses.filter(c => !c.approved).length; }
  goCreate() { window.location.href = '/instructor/courses/create'; }
}
