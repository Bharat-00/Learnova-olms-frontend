import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ProgressService } from '../../../core/services/progress.service';
import { CourseProgress } from '../../../core/models';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Progress</h1>
          <p class="page-subtitle">Track your learning journey across all enrolled courses</p>
        </div>
      </div>

      <div class="stats-grid fade-in-delay-1">
        <div class="card stat-mini">
          <div class="stat-mini-icon" style="background:var(--primary-light);color:var(--primary)"><i class="fas fa-book-open"></i></div>
          <div><div class="stat-mini-val">{{ progressList.length }}</div><div class="stat-mini-lbl">Courses In Progress</div></div>
        </div>
        <div class="card stat-mini">
          <div class="stat-mini-icon" style="background:var(--success-light);color:var(--success)"><i class="fas fa-check-circle"></i></div>
          <div><div class="stat-mini-val">{{ completedCourses }}</div><div class="stat-mini-lbl">Completed</div></div>
        </div>
        <div class="card stat-mini">
          <div class="stat-mini-icon" style="background:var(--warning-light);color:var(--warning)"><i class="fas fa-fire"></i></div>
          <div><div class="stat-mini-val">{{ totalCompleted }}</div><div class="stat-mini-lbl">Lessons Completed</div></div>
        </div>
        <div class="card stat-mini">
          <div class="stat-mini-icon" style="background:var(--info-light);color:var(--info)"><i class="fas fa-chart-line"></i></div>
          <div><div class="stat-mini-val">{{ avgProgress }}%</div><div class="stat-mini-lbl">Average Progress</div></div>
        </div>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="progress-cards" *ngIf="!loading && progressList.length > 0">
        <div class="progress-course-card card" *ngFor="let p of progressList">
          <div class="pcc-header">
            <div class="pcc-icon"><i class="fas fa-book-open"></i></div>
            <div class="pcc-meta">
              <h3 class="pcc-title">{{ p.courseTitle || 'Course #' + p.courseId }}</h3>
              <p class="pcc-last">
                <i class="fas fa-clock"></i>
                Last activity: {{ p.lastActivity ? (p.lastActivity | date:'mediumDate') : 'Not started' }}
              </p>
            </div>
            <div class="pcc-badge" [ngClass]="p.percentage === 100 ? 'badge badge-success' : 'badge badge-primary'">
              {{ p.percentage === 100 ? 'Completed' : 'In Progress' }}
            </div>
          </div>

          <div class="pcc-body">
            <div class="pcc-stats">
              <div class="pcc-stat">
                <span class="pcc-stat-val">{{ p.completedLessons }}</span>
                <span class="pcc-stat-lbl">Completed</span>
              </div>
              <div class="pcc-stat">
                <span class="pcc-stat-val">{{ p.totalLessons - p.completedLessons }}</span>
                <span class="pcc-stat-lbl">Remaining</span>
              </div>
              <div class="pcc-stat">
                <span class="pcc-stat-val">{{ p.totalLessons }}</span>
                <span class="pcc-stat-lbl">Total</span>
              </div>
            </div>
            <div class="pcc-progress-wrap">
              <div class="pcc-pct-label">
                <span>Overall Progress</span>
                <strong>{{ p.percentage }}%</strong>
              </div>
              <div class="progress-bar-container" style="height:10px">
                <div class="progress-bar-fill" [style.width]="p.percentage + '%'"></div>
              </div>
            </div>
          </div>

          <div class="pcc-actions">
            <a [routerLink]="['/student/lesson', p.courseId]" class="btn btn-primary btn-sm">
              <i class="fas fa-play"></i> Continue Learning
            </a>
            <a [routerLink]="['/student/certificates']" *ngIf="p.percentage === 100" class="btn btn-secondary btn-sm">
              <i class="fas fa-certificate"></i> View Certificate
            </a>
          </div>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && progressList.length === 0"
        icon="fa-chart-line"
        title="No progress to show"
        message="Start watching lessons in your enrolled courses to track progress here."
        actionLabel="Go to My Courses"
        (action)="goToCourses()" />
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
    .stat-mini { display: flex; align-items: center; gap: 14px; padding: 18px; }
    .stat-mini-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
    .stat-mini-val { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; line-height: 1; }
    .stat-mini-lbl { font-size: 0.78rem; color: var(--gray-500); margin-top: 3px; }
    .progress-cards { display: flex; flex-direction: column; gap: 20px; }
    .progress-course-card { display: flex; flex-direction: column; gap: 16px; }
    .pcc-header { display: flex; align-items: flex-start; gap: 14px; }
    .pcc-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .pcc-meta { flex: 1; }
    .pcc-title { font-size: 1.05rem; font-weight: 600; margin-bottom: 4px; }
    .pcc-last { font-size: 0.8rem; color: var(--gray-400); display: flex; align-items: center; gap: 5px; }
    .pcc-body {}
    .pcc-stats { display: flex; gap: 24px; margin-bottom: 16px; }
    .pcc-stat { text-align: center; }
    .pcc-stat-val { display: block; font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; color: var(--gray-800); }
    .pcc-stat-lbl { font-size: 0.75rem; color: var(--gray-500); }
    .pcc-progress-wrap {}
    .pcc-pct-label { display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 6px; }
    .pcc-pct-label strong { color: var(--primary); }
    .pcc-actions { display: flex; gap: 10px; padding-top: 12px; border-top: 1px solid var(--gray-100); }
    @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class ProgressComponent implements OnInit {
  progressList: CourseProgress[] = [];
  loading = true;

  constructor(private progressService: ProgressService) {}

  ngOnInit() {
    this.progressService.getAllMyProgress().subscribe({
      next: data => { this.progressList = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get completedCourses() { return this.progressList.filter(p => p.percentage === 100).length; }
  get totalCompleted()   { return this.progressList.reduce((sum, p) => sum + p.completedLessons, 0); }
  get avgProgress() {
    if (!this.progressList.length) return 0;
    return Math.round(this.progressList.reduce((s, p) => s + p.percentage, 0) / this.progressList.length);
  }

  goToCourses() { window.location.href = '/student/courses'; }
}
