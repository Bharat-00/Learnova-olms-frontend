import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Courses</h1>
          <p class="page-subtitle">Manage your courses, lessons, and assessments</p>
        </div>
        <a routerLink="/instructor/courses/create" class="btn btn-primary">
          <i class="fas fa-plus"></i> Create Course
        </a>
      </div>

      <div class="alert alert-success fade-in" *ngIf="successMsg">
        <i class="fas fa-check-circle"></i> {{ successMsg }}
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="courses-table-wrap" *ngIf="!loading && courses.length > 0">
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Students</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of courses">
                <td>
                  <div class="course-cell">
                    <div class="cc-icon"><i class="fas fa-book-open"></i></div>
                    <div>
                      <div class="cc-title">{{ c.title }}</div>
                      <div class="cc-meta">{{ c.level }} &bull; {{ c.isFree ? 'Free' : '$' + c.price }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-gray">{{ c.category }}</span></td>
                <td>{{ c.totalEnrollments || 0 }}</td>
                <td>
                  <span class="badge" [ngClass]="c.published ? 'badge-success' : 'badge-gray'">
                    {{ c.published ? 'Published' : 'Draft' }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="c.approved ? 'badge-success' : 'badge-warning'">
                    {{ c.approved ? 'Approved' : 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/instructor/courses/edit', c.id]" class="btn btn-secondary btn-sm" title="Edit">
                      <i class="fas fa-edit"></i>
                    </a>
                    <a [routerLink]="['/instructor/lessons', c.id]" class="btn btn-secondary btn-sm" title="Lessons">
                      <i class="fas fa-list"></i>
                    </a>
                    <a [routerLink]="['/instructor/assesments', c.id]" class="btn btn-secondary btn-sm" title="Assesments">
                      <i class="fas fa-clipboard-list"></i>
                    </a>
                    <button class="btn btn-sm" [ngClass]="c.published ? 'btn-warning' : 'btn-success'"
                            (click)="togglePublish(c)" title="{{ c.published ? 'Unpublish' : 'Publish' }}">
                      <i class="fas" [class.fa-eye-slash]="c.published" [class.fa-globe]="!c.published"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="confirmDelete(c)" title="Delete">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && courses.length === 0"
        icon="fa-book" title="No courses yet"
        message="Create your first course and start teaching."
        actionLabel="Create Course"
        (action)="goCreate()" />
    </div>

    <app-confirmation-modal
      [visible]="showDeleteModal"
      title="Delete Course"
      message="Are you sure you want to delete '{{ courseToDelete?.title }}'? This action cannot be undone."
      type="danger"
      confirmLabel="Delete"
      [loading]="deleting"
      (confirm)="deleteCourse()"
      (cancel)="showDeleteModal = false" />
  `,
  styles: [`
    .courses-table-wrap { }
    .course-cell { display: flex; align-items: center; gap: 12px; }
    .cc-icon { width: 40px; height: 40px; border-radius: var(--radius); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .cc-title { font-weight: 500; font-size: 0.9rem; }
    .cc-meta { font-size: 0.75rem; color: var(--gray-400); margin-top: 2px; }
    .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .btn-warning { background: var(--warning); color: #fff; border-color: var(--warning); }
    .btn-warning:hover { background: #d97706; }
  `]
})
export class InstructorCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  showDeleteModal = false;
  deleting = false;
  courseToDelete: Course | null = null;
  successMsg = '';

  constructor(private courseService: CourseService, private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.courseService.getCoursesByInstructor(user.id).subscribe({
        next: data => { this.courses = data; this.loading = false; },
        error: () => { this.loading = false; }
      });
    }
  }

  togglePublish(c: Course) {
    const action = c.published ? this.courseService.unpublishCourse(c.id) : this.courseService.publishCourse(c.id);
    action.subscribe({
      next: updated => {
        const idx = this.courses.findIndex(x => x.id === c.id);
        if (idx !== -1) this.courses[idx] = updated;
        this.successMsg = `Course ${updated.published ? 'published' : 'unpublished'} successfully!`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => {}
    });
  }

  confirmDelete(c: Course) { this.courseToDelete = c; this.showDeleteModal = true; }

  deleteCourse() {
    if (!this.courseToDelete) return;
    this.deleting = true;
    this.courseService.deleteCourse(this.courseToDelete.id).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c.id !== this.courseToDelete!.id);
        this.deleting = false; this.showDeleteModal = false;
        this.successMsg = 'Course deleted successfully.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }

  goCreate() { window.location.href = '/instructor/courses/create'; }
}
