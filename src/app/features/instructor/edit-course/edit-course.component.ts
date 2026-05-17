import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Edit Course</h1>
          <p class="page-subtitle">Update your course information</p>
        </div>
        <a routerLink="/instructor/courses" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back
        </a>
      </div>

      <app-loading-spinner *ngIf="pageLoading" />

      <div class="edit-layout" *ngIf="!pageLoading">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="card form-section">
            <h3 class="section-label">Basic Information</h3>
            <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
            <div class="alert alert-danger"  *ngIf="errorMsg"><i class="fas fa-exclamation-circle"></i> {{ errorMsg }}</div>

            <div class="form-group">
              <label class="form-label">Course Title</label>
              <input type="text" formControlName="title" class="form-control">
            </div>
            <div class="form-group">
              <label class="form-label">Short Description</label>
              <input type="text" formControlName="shortDescription" class="form-control">
            </div>
            <div class="form-group">
              <label class="form-label">Full Description</label>
              <textarea formControlName="description" class="form-control" rows="5"></textarea>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Category</label>
                <select formControlName="category" class="form-control form-select">
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Level</label>
                <select formControlName="level" class="form-control form-select">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Language</label>
                <select formControlName="language" class="form-control form-select">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Pricing</label>
                <select formControlName="isFree" class="form-control form-select">
                  <option [ngValue]="true">Free</option>
                  <option [ngValue]="false">Paid</option>
                </select>
              </div>
              <div class="form-group" *ngIf="!f['isFree'].value">
                <label class="form-label">Price (USD)</label>
                <input type="number" formControlName="price" class="form-control" min="0" step="0.01">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Thumbnail URL</label>
              <input type="url" formControlName="thumbnailUrl" class="form-control">
            </div>
          </div>

          <div class="form-actions">
            <a routerLink="/instructor/courses" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="saving" class="spinner-sm"></span>
              <i *ngIf="!saving" class="fas fa-save"></i>
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

        <aside class="edit-sidebar">
          <div class="card">
            <h4 class="sidebar-section-title">Course Management</h4>
            <div class="management-links">
              <a [routerLink]="['/instructor/lessons', courseId]" class="mgmt-link">
                <i class="fas fa-list"></i> Manage Lessons
              </a>
              <a [routerLink]="['/instructor/assesments', courseId]" class="mgmt-link">
                <i class="fas fa-clipboard-list"></i> Manage Assesments
              </a>
              <a [routerLink]="['/instructor/students']" class="mgmt-link">
                <i class="fas fa-users"></i> View Students
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .edit-layout { display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: start; }
    form { display: flex; flex-direction: column; gap: 20px; }
    .section-label { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-500); margin-bottom: 20px; }
    .form-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-actions { display: flex; justify-content: flex-end; gap: 12px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .edit-sidebar { position: sticky; top: 80px; }
    .sidebar-section-title { font-size: 0.875rem; font-weight: 700; margin-bottom: 16px; }
    .management-links { display: flex; flex-direction: column; gap: 6px; }
    .mgmt-link { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius); font-size: 0.875rem; color: var(--gray-600); transition: var(--transition); }
    .mgmt-link:hover { background: var(--primary-light); color: var(--primary); }
    .mgmt-link i { width: 16px; text-align: center; }
    @media (max-width: 900px) { .edit-layout { grid-template-columns: 1fr; } .edit-sidebar { position: static; } .form-row-3 { grid-template-columns: 1fr; } }
  `]
})
export class EditCourseComponent implements OnInit {
  form!: FormGroup;
  pageLoading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';
  courseId = 0;
  categories = ['Development', 'Business', 'Design', 'Data Science', 'Cloud & DevOps', 'Security', 'Marketing'];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private courseService: CourseService) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getCourseById(this.courseId).subscribe({
      next: course => {
        this.form = this.fb.group({
          title:            [course.title, Validators.required],
          shortDescription: [course.shortDescription || ''],
          description:      [course.description, Validators.required],
          category:         [course.category, Validators.required],
          level:            [course.level],
          language:         [course.language || 'English'],
          isFree:           [course.isFree],
          price:            [course.price || 0],
          thumbnailUrl:     [course.thumbnailUrl || '']
        });
        this.pageLoading = false;
      },
      error: () => { this.pageLoading = false; }
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.courseService.updateCourse(this.courseId, this.form.value).subscribe({
      next: () => { this.saving = false; this.successMsg = 'Course updated successfully!'; setTimeout(() => this.successMsg = '', 3000); },
      error: err => { this.saving = false; this.errorMsg = err.userMessage || 'Update failed.'; }
    });
  }
}
