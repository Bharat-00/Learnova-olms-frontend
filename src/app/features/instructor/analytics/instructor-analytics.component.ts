// ─── Instructor Analytics ─────────────────────────────────────────────────────
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-instructor-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div><h1 class="page-title">Analytics</h1><p class="page-subtitle">Performance overview of your courses</p></div>
      </div>
      <div class="stats-grid fade-in-delay-1">
        <app-stats-card label="Total Courses"  [value]="courses.length"      icon="fa-book"    color="var(--primary)" />
        <app-stats-card label="Published"      [value]="published"           icon="fa-globe"   color="var(--success)" />
        <app-stats-card label="Total Students" [value]="totalStudents"       icon="fa-users"   color="var(--warning)" />
        <app-stats-card label="Avg. Rating"    [value]="avgRating"           icon="fa-star"    color="var(--info)" />
      </div>
      <div class="card fade-in-delay-2">
        <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px">Course Performance</h3>
        <div class="table-container">
          <table>
            <thead><tr><th>Course</th><th>Students</th><th>Rating</th><th>Status</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of courses">
                <td><strong>{{ c.title }}</strong></td>
                <td>{{ c.totalEnrollments || 0 }}</td>
                <td>
                  <span *ngIf="c.rating"><i class="fas fa-star" style="color:var(--warning)"></i> {{ c.rating }}</span>
                  <span *ngIf="!c.rating" class="text-muted">No ratings</span>
                </td>
                <td><span class="badge" [ngClass]="c.published ? 'badge-success' : 'badge-gray'">{{ c.published ? 'Published' : 'Draft' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="analytics-placeholder card" style="background:var(--gray-50);margin-top:20px;text-align:center;padding:40px">
          <i class="fas fa-chart-line" style="font-size:3rem;color:var(--gray-300);display:block;margin-bottom:12px"></i>
          <p style="color:var(--gray-400);font-size:0.9rem">Detailed analytics charts (revenue, enrollment trends, completion rates) will be available in a future update.</p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class InstructorAnalyticsComponent implements OnInit {
  courses: Course[] = [];
  constructor(private courseService: CourseService, private authService: AuthService) {}
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) this.courseService.getCoursesByInstructor(user.id).subscribe({ next: d => this.courses = d, error: () => {} });
  }
  get published()      { return this.courses.filter(c => c.published).length; }
  get totalStudents()  { return this.courses.reduce((s, c) => s + (c.totalEnrollments || 0), 0); }
  get avgRating()      { const r = this.courses.filter(c => c.rating); return r.length ? (r.reduce((s, c) => s + c.rating!, 0) / r.length).toFixed(1) : '—'; }
}
