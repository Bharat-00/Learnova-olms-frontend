// ─── Instructor Students ──────────────────────────────────────────────────────
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Enrollment, Course } from '../../../core/models';

@Component({
  selector: 'app-instructor-students',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Enrolled Students</h1>
          <p class="page-subtitle">Students enrolled across your courses</p>
        </div>
      </div>

      <div class="filter-row">
        <select class="form-control form-select" style="width:240px" [(ngModel)]="selectedCourseId" (change)="onCourseChange()">
          <option value="0">All Courses</option>
          <option *ngFor="let c of courses" [value]="c.id">{{ c.title }}</option>
        </select>
        <input type="text" class="form-control" style="width:260px" [(ngModel)]="searchQuery" placeholder="Search students...">
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="table-container" *ngIf="!loading && filtered.length > 0">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Enrolled Date</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filtered">
              <td>
                <div class="student-cell">
                  <div class="avatar avatar-sm">{{ (e.courseName || 'S')[0] }}</div>
                  <span>Student #{{ e.userId }}</span>
                </div>
              </td>
              <td>{{ e.courseName || 'Course #' + e.courseId }}</td>
              <td>{{ e.enrolledAt | date:'mediumDate' }}</td>
              <td>
                <div class="progress-cell">
                  <div class="progress-bar-container" style="width:100px">
                    <div class="progress-bar-fill" [style.width]="(e.completionPercent || 0) + '%'"></div>
                  </div>
                  <span class="progress-label">{{ e.completionPercent || 0 }}%</span>
                </div>
              </td>
              <td>
                <span class="badge" [ngClass]="e.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'">{{ e.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-empty-state *ngIf="!loading && filtered.length === 0"
        icon="fa-users" title="No students yet"
        message="Students will appear here when they enroll in your courses." />
    </div>
  `,
  styles: [`
    .filter-row { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
    .student-cell { display: flex; align-items: center; gap: 10px; }
    .progress-cell { display: flex; align-items: center; gap: 8px; }
    .progress-label { font-size: 0.78rem; font-weight: 600; color: var(--primary); white-space: nowrap; }
  `]
})
export class InstructorStudentsComponent implements OnInit {
  enrollments: Enrollment[] = [];
  courses: Course[] = [];
  loading = true;
  selectedCourseId = 0;
  searchQuery = '';

  constructor(private enrollmentService: EnrollmentService, private courseService: CourseService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.courseService.getCoursesByInstructor(user.id).subscribe({ next: cs => { this.courses = cs; this.loadEnrollments(); }, error: () => { this.loading = false; } });
    }
  }

  loadEnrollments() {
    if (this.courses.length === 0) { this.loading = false; return; }
    const courseId = this.selectedCourseId || this.courses[0]?.id;
    this.enrollmentService.getEnrollmentsByCourse(courseId).subscribe({
      next: data => { this.enrollments = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onCourseChange() { this.loading = true; this.loadEnrollments(); }

  get filtered(): Enrollment[] {
    return this.enrollments.filter(e =>
      !this.searchQuery || String(e.userId).includes(this.searchQuery) || (e.courseName || '').toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
