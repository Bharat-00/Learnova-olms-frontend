import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LessonService } from '../../../core/services/lesson.service';

@Component({
  selector: 'app-add-lesson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEdit ? 'Edit Lesson' : 'Add New Lesson' }}</h1>
          <p class="page-subtitle">{{ isEdit ? 'Update lesson details' : 'Add a lesson to your course curriculum' }}</p>
        </div>
        <a [routerLink]="['/instructor/lessons', courseId]" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back to Lessons
        </a>
      </div>

      <div class="card" style="max-width:720px">
        <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
        <div class="alert alert-danger"  *ngIf="errorMsg"><i class="fas fa-exclamation-circle"></i> {{ errorMsg }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Lesson Title <span class="required">*</span></label>
            <input type="text" formControlName="title" class="form-control"
                   [class.is-invalid]="f['title'].invalid && f['title'].touched"
                   placeholder="e.g. Introduction to Components">
            <div class="invalid-feedback" *ngIf="f['title'].invalid && f['title'].touched">Title is required.</div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea formControlName="description" class="form-control" rows="3"
                      placeholder="Brief description of what this lesson covers..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Lesson Type <span class="required">*</span></label>
              <select formControlName="type" class="form-control form-select">
                <option value="VIDEO">Video</option>
                <option value="TEXT">Text / Article</option>
                <option value="QUIZ">Quiz</option>
                <option value="RESOURCE">Resource</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Duration (minutes)</label>
              <input type="number" formControlName="duration" class="form-control" placeholder="15" min="1">
            </div>
            <div class="form-group">
              <label class="form-label">Order Index</label>
              <input type="number" formControlName="orderIndex" class="form-control" placeholder="1" min="1">
            </div>
          </div>

          <div class="form-group" *ngIf="f['type'].value === 'VIDEO'">
            <label class="form-label">Video URL</label>
            <input type="url" formControlName="videoUrl" class="form-control" placeholder="https://...">
            <small class="text-muted">Supports YouTube, Vimeo, or direct video URLs.</small>
          </div>

          <div class="form-group" *ngIf="f['type'].value === 'TEXT'">
            <label class="form-label">Lesson Content</label>
            <textarea formControlName="content" class="form-control" rows="8"
                      placeholder="Write your lesson content here..."></textarea>
          </div>

          <div class="form-group">
            <label class="toggle-label">
              <input type="checkbox" formControlName="isFree">
              <span class="toggle-text">Make this lesson a free preview</span>
              <span class="toggle-hint">Students can view this lesson without enrolling</span>
            </label>
          </div>

          <div class="form-submit">
            <a [routerLink]="['/instructor/lessons', courseId]" class="btn btn-secondary">Cancel</a>
            <button type="submit" class="btn btn-primary" [disabled]="saving">
              <span *ngIf="saving" class="spinner-sm"></span>
              <i *ngIf="!saving" class="fas fa-save"></i>
              {{ saving ? 'Saving...' : (isEdit ? 'Update Lesson' : 'Add Lesson') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .required { color: var(--danger); }
    .form-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    small.text-muted { font-size: 0.78rem; color: var(--gray-400); display: block; margin-top: 4px; }
    .toggle-label { display: flex; flex-direction: column; gap: 3px; cursor: pointer; }
    .toggle-label input { accent-color: var(--primary); width: 16px; height: 16px; }
    .toggle-text { font-size: 0.9rem; font-weight: 500; color: var(--gray-700); }
    .toggle-hint { font-size: 0.78rem; color: var(--gray-400); }
    .form-submit { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class AddLessonComponent implements OnInit {
  form!: FormGroup;
  courseId = 0;
  editId = 0;
  isEdit = false;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private lessonService: LessonService) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.editId = Number(this.route.snapshot.queryParams['edit'] || 0);
    this.isEdit = !!this.editId;

    this.form = this.fb.group({
      title:       ['', Validators.required],
      description: [''],
      type:        ['VIDEO'],
      duration:    [null],
      orderIndex:  [1],
      videoUrl:    [''],
      content:     [''],
      isFree:      [false]
    });

    if (this.isEdit) {
      this.lessonService.getLessonById(this.editId).subscribe({
        next: l => this.form.patchValue(l),
        error: () => {}
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.successMsg = '';
    this.errorMsg = '';
    const payload = { ...this.form.value, courseId: this.courseId };
    const action = this.isEdit
      ? this.lessonService.updateLesson(this.editId, payload)
      : this.lessonService.createLesson(payload);
    action.subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = this.isEdit ? 'Lesson updated!' : 'Lesson added!';
        setTimeout(() => this.router.navigate(['/instructor/lessons', this.courseId]), 1200);
      },
      error: err => { this.saving = false; this.errorMsg = err.userMessage || 'Failed to save lesson.'; }
    });
  }
}
