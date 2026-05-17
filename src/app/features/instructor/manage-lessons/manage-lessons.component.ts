import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { LessonService } from '../../../core/services/lesson.service';
import { Lesson } from '../../../core/models';

@Component({
  selector: 'app-manage-lessons',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Manage Lessons</h1>
          <p class="page-subtitle">Add and manage lessons for Course #{{ courseId }}</p>
        </div>
        <a [routerLink]="['/instructor/lessons', courseId, 'add']" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add Lesson
        </a>
      </div>

      <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>

      <app-loading-spinner *ngIf="loading" />

      <div class="lessons-list" *ngIf="!loading && lessons.length > 0">
        <div class="lesson-row card" *ngFor="let lesson of lessons; let i = index">
          <div class="lesson-handle"><i class="fas fa-grip-vertical"></i></div>
          <div class="lesson-order">{{ i + 1 }}</div>
          <div class="lesson-type-icon" [ngClass]="typeClass(lesson.type)">
            <i class="fas" [ngClass]="typeIcon(lesson.type)"></i>
          </div>
          <div class="lesson-info">
            <div class="lesson-title-text">{{ lesson.title }}</div>
            <div class="lesson-meta-row">
              <span class="badge badge-gray">{{ lesson.type }}</span>
              <span *ngIf="lesson.duration"><i class="fas fa-clock"></i> {{ lesson.duration }} min</span>
              <span class="badge badge-success" *ngIf="lesson.isFree">Free Preview</span>
            </div>
          </div>
          <div class="lesson-actions">
            <a [routerLink]="['/instructor/lessons', courseId, 'add']"
               [queryParams]="{edit: lesson.id}" class="btn btn-secondary btn-sm">
              <i class="fas fa-edit"></i> Edit
            </a>
            <button class="btn btn-danger btn-sm" (click)="confirmDelete(lesson)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && lessons.length === 0"
        icon="fa-list" title="No lessons yet"
        message="Add your first lesson to start building the course curriculum."
        actionLabel="Add Lesson" (action)="goAdd()" />
    </div>

    <app-confirmation-modal
      [visible]="showDeleteModal"
      title="Delete Lesson"
      [message]="'Delete lesson: ' + (lessonToDelete?.title || '') + '?'"
      type="danger" confirmLabel="Delete"
      [loading]="deleting"
      (confirm)="deleteLesson()"
      (cancel)="showDeleteModal = false" />
  `,
  styles: [`
    .lessons-list { display: flex; flex-direction: column; gap: 10px; }
    .lesson-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; }
    .lesson-handle { color: var(--gray-300); cursor: grab; font-size: 1rem; }
    .lesson-order { width: 28px; height: 28px; border-radius: 50%; background: var(--gray-100); color: var(--gray-500); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
    .lesson-type-icon { width: 40px; height: 40px; border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; }
    .lesson-type-icon.video    { background: var(--primary-light); color: var(--primary); }
    .lesson-type-icon.text     { background: var(--success-light); color: var(--success); }
    .lesson-type-icon.quiz     { background: var(--warning-light); color: var(--warning); }
    .lesson-type-icon.resource { background: var(--info-light); color: var(--info); }
    .lesson-info { flex: 1; min-width: 0; }
    .lesson-title-text { font-size: 0.9rem; font-weight: 500; margin-bottom: 5px; }
    .lesson-meta-row { display: flex; align-items: center; gap: 10px; font-size: 0.78rem; color: var(--gray-400); }
    .lesson-meta-row span { display: flex; align-items: center; gap: 4px; }
    .lesson-actions { display: flex; gap: 6px; flex-shrink: 0; }
  `]
})
export class ManageLessonsComponent implements OnInit {
  lessons: Lesson[] = [];
  courseId = 0;
  loading = true;
  showDeleteModal = false;
  deleting = false;
  lessonToDelete: Lesson | null = null;
  successMsg = '';

  constructor(private route: ActivatedRoute, private lessonService: LessonService) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.lessonService.getLessonsByCourse(this.courseId).subscribe({
      next: data => { this.lessons = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  typeClass(type: string): string {
    return { VIDEO: 'video', TEXT: 'text', QUIZ: 'quiz', RESOURCE: 'resource' }[type] || 'video';
  }

  typeIcon(type: string): string {
    return { VIDEO: 'fa-play-circle', TEXT: 'fa-file-alt', QUIZ: 'fa-clipboard-list', RESOURCE: 'fa-paperclip' }[type] || 'fa-play-circle';
  }

  confirmDelete(l: Lesson) { this.lessonToDelete = l; this.showDeleteModal = true; }

  deleteLesson() {
    if (!this.lessonToDelete) return;
    this.deleting = true;
    this.lessonService.deleteLesson(this.lessonToDelete.id).subscribe({
      next: () => {
        this.lessons = this.lessons.filter(l => l.id !== this.lessonToDelete!.id);
        this.deleting = false; this.showDeleteModal = false;
        this.successMsg = 'Lesson deleted.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }

  goAdd() { window.location.href = `/instructor/lessons/${this.courseId}/add`; }
}
