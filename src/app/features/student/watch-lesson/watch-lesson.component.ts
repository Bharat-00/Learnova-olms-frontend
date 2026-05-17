import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { LessonService } from '../../../core/services/lesson.service';
import { ProgressService } from '../../../core/services/progress.service';
import { Lesson } from '../../../core/models';

@Component({
  selector: 'app-watch-lesson',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ currentLesson?.title || 'Watch Lesson' }}</h1>
          <p class="page-subtitle">{{ currentLesson?.type }} • {{ currentLesson?.duration }} min</p>
        </div>
        <a routerLink="/student/courses" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back to Courses
        </a>
      </div>

      <app-loading-spinner *ngIf="loading" />

      <div class="lesson-layout" *ngIf="!loading">
        <!-- Video / Content Area -->
        <div class="lesson-main">
          <div class="video-area" *ngIf="currentLesson?.videoUrl">
            <video controls class="lesson-video" [src]="currentLesson!.videoUrl">
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="video-placeholder" *ngIf="!currentLesson?.videoUrl">
            <div class="placeholder-inner">
              <i class="fas fa-play-circle"></i>
              <h3>Video Content</h3>
              <p>The video for this lesson is not yet available or will be streamed from your server.</p>
            </div>
          </div>

          <div class="lesson-info-card card" *ngIf="currentLesson">
            <h2>{{ currentLesson.title }}</h2>
            <p *ngIf="currentLesson.description">{{ currentLesson.description }}</p>
            <div class="lesson-content" *ngIf="currentLesson.content">
              <hr class="divider">
              <h3>Content</h3>
              <div class="content-text">{{ currentLesson.content }}</div>
            </div>
            <div class="lesson-actions">
              <button class="btn btn-success" (click)="markComplete()" [disabled]="completed || marking">
                <span *ngIf="marking" class="spinner-sm"></span>
                <i *ngIf="!marking && !completed" class="fas fa-check"></i>
                <i *ngIf="completed" class="fas fa-check-circle"></i>
                {{ completed ? 'Lesson Completed!' : 'Mark as Complete' }}
              </button>
              <button class="btn btn-primary" (click)="nextLesson()" [disabled]="!hasNext">
                <i class="fas fa-forward"></i> Next Lesson
              </button>
            </div>
          </div>
        </div>

        <!-- Lesson Sidebar -->
        <aside class="lesson-sidebar">
          <div class="sidebar-header">
            <h3>Course Curriculum</h3>
            <div class="sidebar-progress">{{ completedLessons }} / {{ lessons.length }} completed</div>
          </div>
          <div class="lesson-sidebar-list">
            <div class="sidebar-lesson" *ngFor="let lesson of lessons; let i = index"
                 [class.active]="lesson.id === currentLesson?.id"
                 [class.done]="lessonStatus[lesson.id]"
                 (click)="selectLesson(lesson)">
              <div class="lesson-num">
                <i *ngIf="lessonStatus[lesson.id]" class="fas fa-check-circle text-success"></i>
                <span *ngIf="!lessonStatus[lesson.id]">{{ i + 1 }}</span>
              </div>
              <div class="lesson-sidebar-info">
                <div class="ls-title">{{ lesson.title }}</div>
                <div class="ls-meta">
                  <span><i class="fas fa-play-circle"></i> {{ lesson.type }}</span>
                  <span *ngIf="lesson.duration">{{ lesson.duration }} min</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .lesson-layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
    .video-area { border-radius: var(--radius-lg); overflow: hidden; background: #000; margin-bottom: 20px; }
    .lesson-video { width: 100%; max-height: 480px; display: block; }
    .video-placeholder {
      background: var(--gray-900); border-radius: var(--radius-lg);
      height: 360px; display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    .placeholder-inner { text-align: center; color: var(--gray-400); }
    .placeholder-inner i { font-size: 4rem; color: var(--gray-600); margin-bottom: 16px; display: block; }
    .placeholder-inner h3 { color: var(--gray-300); margin-bottom: 8px; }
    .placeholder-inner p { font-size: 0.875rem; max-width: 360px; }
    .lesson-info-card h2 { font-size: 1.2rem; margin-bottom: 10px; }
    .lesson-info-card p { color: var(--gray-500); font-size: 0.9rem; line-height: 1.7; }
    .content-text { font-size: 0.9rem; color: var(--gray-600); line-height: 1.8; white-space: pre-wrap; }
    .lesson-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--gray-100); }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .lesson-sidebar {
      background: var(--white); border: 1px solid var(--gray-200);
      border-radius: var(--radius-lg); height: fit-content; position: sticky; top: 80px; overflow: hidden;
    }
    .sidebar-header { padding: 16px 18px; border-bottom: 1px solid var(--gray-100); }
    .sidebar-header h3 { font-size: 0.95rem; font-weight: 600; margin-bottom: 4px; }
    .sidebar-progress { font-size: 0.78rem; color: var(--gray-500); }
    .lesson-sidebar-list { max-height: 600px; overflow-y: auto; }
    .sidebar-lesson {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 18px; cursor: pointer; transition: var(--transition);
      border-bottom: 1px solid var(--gray-50);
    }
    .sidebar-lesson:hover { background: var(--gray-50); }
    .sidebar-lesson.active { background: var(--primary-light); }
    .sidebar-lesson.done .lesson-num { color: var(--success); }
    .lesson-num {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--gray-100); display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem; font-weight: 700; color: var(--gray-500); flex-shrink: 0; margin-top: 2px;
    }
    .sidebar-lesson.active .lesson-num { background: var(--primary); color: #fff; }
    .ls-title { font-size: 0.85rem; font-weight: 500; color: var(--gray-800); margin-bottom: 3px; }
    .ls-meta { display: flex; gap: 10px; font-size: 0.72rem; color: var(--gray-400); }
    .ls-meta span { display: flex; align-items: center; gap: 3px; }
    .text-success { color: var(--success); }
    @media (max-width: 900px) {
      .lesson-layout { grid-template-columns: 1fr; }
      .lesson-sidebar { position: static; }
    }
  `]
})
export class WatchLessonComponent implements OnInit {
  lessons: Lesson[] = [];
  currentLesson: Lesson | null = null;
  loading = true;
  completed = false;
  marking = false;
  lessonStatus: Record<number, boolean> = {};
  completedLessons = 0;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private progressService: ProgressService
  ) {}

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.lessonService.getLessonsByCourse(courseId).subscribe({
      next: lessons => {
        this.lessons = lessons;
        if (lessons.length > 0) this.currentLesson = lessons[0];
        this.loading = false;
        this.loadProgress(courseId);
      },
      error: () => { this.loading = false; }
    });
  }

  loadProgress(courseId: number) {
    this.progressService.getLessonCompletionStatus(courseId).subscribe({
      next: statuses => {
        this.lessonStatus = {};
        statuses.forEach(s => this.lessonStatus[s.lessonId] = s.completed);
        this.completedLessons = statuses.filter(s => s.completed).length;
        if (this.currentLesson) this.completed = !!this.lessonStatus[this.currentLesson.id];
      },
      error: () => {}
    });
  }

  selectLesson(lesson: Lesson) {
    this.currentLesson = lesson;
    this.completed = !!this.lessonStatus[lesson.id];
  }

  markComplete() {
    if (!this.currentLesson) return;
    this.marking = true;
    const courseId = Number(this.route.snapshot.paramMap.get('lessonId'));
    this.progressService.markLessonComplete(this.currentLesson.id, courseId).subscribe({
      next: () => {
        this.completed = true;
        this.lessonStatus[this.currentLesson!.id] = true;
        this.completedLessons = Object.values(this.lessonStatus).filter(Boolean).length;
        this.marking = false;
      },
      error: () => { this.marking = false; }
    });
  }

  get hasNext(): boolean {
    if (!this.currentLesson) return false;
    const idx = this.lessons.findIndex(l => l.id === this.currentLesson!.id);
    return idx < this.lessons.length - 1;
  }

  nextLesson() {
    if (!this.currentLesson) return;
    const idx = this.lessons.findIndex(l => l.id === this.currentLesson!.id);
    if (idx < this.lessons.length - 1) {
      this.currentLesson = this.lessons[idx + 1];
      this.completed = !!this.lessonStatus[this.currentLesson.id];
    }
  }
}
