import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models';

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent, EmptyStateComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div><h1 class="page-title">Manage Courses</h1><p class="page-subtitle">Review, approve and manage all courses</p></div>
      </div>

      <div class="filter-tabs">
        <button class="tab-btn" [class.active]="tab === 'all'"     (click)="setTab('all')">All ({{ courses.length }})</button>
        <button class="tab-btn" [class.active]="tab === 'pending'" (click)="setTab('pending')">Pending Approval ({{ pending }})</button>
        <button class="tab-btn" [class.active]="tab === 'published'" (click)="setTab('published')">Published</button>
      </div>

      <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
      <app-loading-spinner *ngIf="loading" />

      <div class="table-container" *ngIf="!loading && filtered.length > 0">
        <table>
          <thead>
            <tr><th>Course</th><th>Instructor</th><th>Category</th><th>Price</th><th>Status</th><th>Approval</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of filtered">
              <td>
                <div class="course-cell">
                  <div class="cc-icon"><i class="fas fa-book-open"></i></div>
                  <div><div class="cc-title">{{ c.title }}</div><div class="cc-level">{{ c.level }}</div></div>
                </div>
              </td>
              <td class="text-sm text-muted">#{{ c.instructorId }}</td>
              <td><span class="badge badge-gray">{{ c.category }}</span></td>
              <td>{{ c.isFree ? 'Free' : '$' + c.price }}</td>
              <td><span class="badge" [ngClass]="c.published ? 'badge-success' : 'badge-gray'">{{ c.published ? 'Published' : 'Draft' }}</span></td>
              <td>
                <span class="badge" [ngClass]="c.approved ? 'badge-success' : 'badge-warning'">
                  {{ c.approved ? 'Approved' : 'Pending' }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="btn btn-success btn-sm" *ngIf="!c.approved" (click)="approve(c)">
                    <i class="fas fa-check"></i> Approve
                  </button>
                  <button class="btn btn-warning btn-sm" *ngIf="c.approved" (click)="reject(c)">
                    <i class="fas fa-times"></i> Reject
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="confirmDelete(c)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-empty-state *ngIf="!loading && filtered.length === 0" icon="fa-book" title="No courses" message="No courses match the current filter." />
    </div>

    <app-confirmation-modal [visible]="showModal" title="Delete Course"
      [message]="'Delete course: ' + (toDelete?.title || '') + '?'"
      type="danger" confirmLabel="Delete" [loading]="deleting"
      (confirm)="doDelete()" (cancel)="showModal = false" />
  `,
  styles: [`
    .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .tab-btn { padding: 8px 18px; border-radius: var(--radius-full); border: 1.5px solid var(--gray-200); background: var(--white); font-size: 0.875rem; font-weight: 500; cursor: pointer; color: var(--gray-600); transition: var(--transition); }
    .tab-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .course-cell { display: flex; align-items: center; gap: 10px; }
    .cc-icon { width: 36px; height: 36px; border-radius: var(--radius); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .cc-title { font-size: 0.875rem; font-weight: 500; }
    .cc-level { font-size: 0.72rem; color: var(--gray-400); }
    .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
    .btn-warning { background: var(--warning); color: #fff; border-color: var(--warning); }
  `]
})
export class AdminCoursesComponent implements OnInit {
  courses: Course[] = [];
  loading = true;
  tab = 'all';
  showModal = false;
  deleting = false;
  toDelete: Course | null = null;
  successMsg = '';

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAllCourses({ size: 100 }).subscribe({
      next: res => { this.courses = res.content || []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  get filtered(): Course[] {
    if (this.tab === 'pending')   return this.courses.filter(c => !c.approved);
    if (this.tab === 'published') return this.courses.filter(c => c.published);
    return this.courses;
  }

  get pending() { return this.courses.filter(c => !c.approved).length; }

  setTab(t: string) { this.tab = t; }

  approve(c: Course) {
    this.courseService.approveCourse(c.id).subscribe({
      next: updated => { Object.assign(c, updated); this.successMsg = 'Course approved!'; setTimeout(() => this.successMsg = '', 3000); },
      error: () => {}
    });
  }

  reject(c: Course) {
    this.courseService.rejectCourse(c.id, 'Does not meet content guidelines.').subscribe({
      next: updated => { Object.assign(c, updated); this.successMsg = 'Course rejected.'; setTimeout(() => this.successMsg = '', 3000); },
      error: () => {}
    });
  }

  confirmDelete(c: Course) { this.toDelete = c; this.showModal = true; }

  doDelete() {
    if (!this.toDelete) return;
    this.deleting = true;
    this.courseService.deleteCourse(this.toDelete.id).subscribe({
      next: () => {
        this.courses = this.courses.filter(c => c.id !== this.toDelete!.id);
        this.deleting = false; this.showModal = false;
        this.successMsg = 'Course deleted.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }
}
