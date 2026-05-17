import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Create New Course</h1>
          <p class="page-subtitle">Fill in the details to create your course</p>
        </div>
        <a routerLink="/instructor/courses" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back
        </a>
      </div>

      <div class="alert alert-danger" *ngIf="errorMsg">
        <i class="fas fa-exclamation-circle"></i> {{ errorMsg }}
      </div>

      <div class="create-course-layout">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <!-- Basic Info -->
          <div class="card form-section">
            <h3 class="section-label">Basic Information</h3>
            <div class="form-group">
              <label class="form-label">Course Title <span class="required">*</span></label>
              <input type="text" formControlName="title" class="form-control"
                     [class.is-invalid]="f['title'].invalid && f['title'].touched"
                     placeholder="e.g. Complete Angular 17 Development Guide">
              <div class="invalid-feedback" *ngIf="f['title'].invalid && f['title'].touched">Title is required.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Short Description <span class="required">*</span></label>
              <input type="text" formControlName="shortDescription" class="form-control"
                     placeholder="A brief one-line description of the course">
            </div>
            <div class="form-group">
              <label class="form-label">Full Description <span class="required">*</span></label>
              <textarea formControlName="description" class="form-control"
                        [class.is-invalid]="f['description'].invalid && f['description'].touched"
                        rows="5" placeholder="Provide a comprehensive description of what students will learn..."></textarea>
              <div class="invalid-feedback" *ngIf="f['description'].invalid && f['description'].touched">Description is required.</div>
            </div>
            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label">Category <span class="required">*</span></label>
                <select formControlName="category" class="form-control form-select"
                        [class.is-invalid]="f['category'].invalid && f['category'].touched">
                  <option value="">Select category</option>
                  <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
                </select>
                <div class="invalid-feedback" *ngIf="f['category'].invalid && f['category'].touched">Required.</div>
              </div>
              <div class="form-group">
                <label class="form-label">Level <span class="required">*</span></label>
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
                  <option value="German">German</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Arabic">Arabic</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="card form-section">
            <h3 class="section-label">Pricing</h3>
            <div class="form-group">
              <label class="form-label">Pricing Type</label>
              <div class="pricing-toggle">
                <label class="price-option" [class.selected]="f['isFree'].value">
                  <input type="radio" [value]="true" formControlName="isFree">
                  <i class="fas fa-gift"></i> Free
                </label>
                <label class="price-option" [class.selected]="!f['isFree'].value">
                  <input type="radio" [value]="false" formControlName="isFree">
                  <i class="fas fa-tag"></i> Paid
                </label>
              </div>
            </div>
            <div class="form-group" *ngIf="!f['isFree'].value">
              <label class="form-label">Price (USD) <span class="required">*</span></label>
              <div class="price-input-wrap">
                <span class="price-prefix">$</span>
                <input type="number" formControlName="price" class="form-control price-input"
                       placeholder="0.00" min="0" step="0.01">
              </div>
            </div>
          </div>

          <!-- Media -->
          <div class="card form-section">
            <h3 class="section-label">Media</h3>
            <div class="form-group">
              <label class="form-label">Thumbnail URL</label>
              <input type="url" formControlName="thumbnailUrl" class="form-control" placeholder="https://example.com/thumbnail.jpg">
              <small class="text-muted">Recommended: 1280x720px (16:9 ratio)</small>
            </div>
          </div>

          <div class="form-submit-row">
            <button type="button" class="btn btn-secondary" routerLink="/instructor/courses">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              <span *ngIf="loading" class="spinner-sm"></span>
              <i *ngIf="!loading" class="fas fa-save"></i>
              {{ loading ? 'Creating...' : 'Create Course' }}
            </button>
          </div>
        </form>

        <!-- Tips Panel -->
        <div class="tips-panel">
          <div class="card">
            <h4 class="tips-title"><i class="fas fa-lightbulb text-warning"></i> Course Creation Tips</h4>
            <ul class="tips-list">
              <li *ngFor="let tip of tips">
                <i class="fas fa-check text-success"></i>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-course-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
    .form-section { margin-bottom: 0; }
    form { display: flex; flex-direction: column; gap: 20px; }
    .section-label { font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--gray-500); margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid var(--gray-100); }
    .required { color: var(--danger); }
    .form-row-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .pricing-toggle { display: flex; gap: 12px; }
    .price-option { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; border: 1.5px solid var(--gray-200); border-radius: var(--radius); cursor: pointer; font-weight: 500; font-size: 0.875rem; color: var(--gray-600); transition: var(--transition); }
    .price-option input { display: none; }
    .price-option.selected { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
    .price-input-wrap { position: relative; }
    .price-prefix { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-500); font-weight: 600; }
    .price-input { padding-left: 28px; }
    small.text-muted { font-size: 0.78rem; color: var(--gray-400); display: block; margin-top: 4px; }
    .form-submit-row { display: flex; justify-content: flex-end; gap: 12px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .tips-panel { position: sticky; top: 80px; }
    .tips-title { font-size: 0.9rem; font-weight: 700; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .text-warning { color: var(--warning); }
    .text-success { color: var(--success); }
    .tips-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .tips-list li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.83rem; color: var(--gray-600); line-height: 1.5; }
    @media (max-width: 900px) { .create-course-layout { grid-template-columns: 1fr; } .tips-panel { position: static; } .form-row-3 { grid-template-columns: 1fr; } }
  `]
})
export class CreateCourseComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  errorMsg = '';
  categories = ['Development', 'Business', 'Design', 'Data Science', 'Cloud & DevOps', 'Security', 'Marketing', 'Personal Development'];
  tips = [
    'Use a clear, searchable title with keywords.',
    'Write a compelling description that explains outcomes.',
    'Add a professional thumbnail for higher click-through.',
    'Set a competitive price based on your course depth.',
    'Courses with 20+ lessons perform better in search.'
  ];

  constructor(private fb: FormBuilder, private courseService: CourseService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      title:            ['', Validators.required],
      shortDescription: [''],
      description:      ['', Validators.required],
      category:         ['', Validators.required],
      level:            ['BEGINNER'],
      language:         ['English'],
      isFree:           [true],
      price:            [0],
      thumbnailUrl:     ['']
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.loading = true;
    this.errorMsg = '';
    const payload = { ...this.form.value, instructorId: user.id };
    this.courseService.createCourse(payload).subscribe({
      next: course => {
        this.loading = false;
        this.router.navigate(['/instructor/lessons', course.id]);
      },
      error: err => { this.loading = false; this.errorMsg = err.userMessage || 'Failed to create course.'; }
    });
  }
}
