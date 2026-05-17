import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmationModalComponent } from '../../../shared/components/confirmation-modal/confirmation-modal.component';
import { AssesmentService } from '../../../core/services/assesment.service';
import { Quiz } from '../../../core/models';

@Component({
  selector: 'app-manage-assesments',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent, EmptyStateComponent, ConfirmationModalComponent],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">Manage Assesments</h1>
          <p class="page-subtitle">Create and manage quizzes for Course #{{ courseId }}</p>
        </div>
        <a [routerLink]="['/instructor/assesments', courseId, 'add']" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add Assesment
        </a>
      </div>

      <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>

      <app-loading-spinner *ngIf="loading" />

      <div class="quiz-cards" *ngIf="!loading && quizzes.length > 0">
        <div class="quiz-card card" *ngFor="let q of quizzes">
          <div class="quiz-card-header">
            <div class="quiz-icon"><i class="fas fa-clipboard-list"></i></div>
            <div class="quiz-meta">
              <h3 class="quiz-title">{{ q.title }}</h3>
              <p class="quiz-desc">{{ q.description || 'No description.' }}</p>
            </div>
          </div>
          <div class="quiz-stats">
            <div class="qs-item">
              <i class="fas fa-question-circle"></i>
              <span>{{ q.totalQuestions || 0 }} Questions</span>
            </div>
            <div class="qs-item" *ngIf="q.timeLimit">
              <i class="fas fa-clock"></i>
              <span>{{ q.timeLimit }} min</span>
            </div>
            <div class="qs-item">
              <i class="fas fa-trophy"></i>
              <span>{{ q.passingScore }}% to pass</span>
            </div>
            <div class="qs-item">
              <i class="fas fa-redo"></i>
              <span>{{ q.allowMultipleAttempts ? 'Multiple attempts' : 'One attempt' }}</span>
            </div>
          </div>
          <div class="quiz-actions">
            <a [routerLink]="['/instructor/assesments', courseId, 'add']"
               [queryParams]="{edit: q.id}" class="btn btn-secondary btn-sm">
              <i class="fas fa-edit"></i> Edit
            </a>
            <button class="btn btn-outline btn-sm" (click)="viewQuestions(q)">
              <i class="fas fa-list"></i> Questions ({{ q.totalQuestions || 0 }})
            </button>
            <button class="btn btn-danger btn-sm" (click)="confirmDelete(q)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>

          <!-- Questions Inline Panel -->
          <div class="questions-panel" *ngIf="activeQuizId === q.id">
            <div class="qp-header">
              <h4>Questions</h4>
              <button class="qp-close" (click)="activeQuizId = 0"><i class="fas fa-times"></i></button>
            </div>
            <div class="question-rows" *ngIf="questions.length > 0">
              <div class="question-row" *ngFor="let qq of questions; let i = index">
                <div class="q-num">{{ i + 1 }}</div>
                <div class="q-info">
                  <div class="q-text">{{ qq.questionText }}</div>
                  <div class="q-meta">
                    <span class="badge badge-gray">{{ qq.type }}</span>
                    <span>{{ qq.points }} pts</span>
                  </div>
                </div>
                <button class="btn btn-danger btn-sm" (click)="deleteQuestion(q.id, qq.id)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <div class="qp-empty" *ngIf="questions.length === 0 && !loadingQuestions">
              No questions yet. Use the edit button to add questions.
            </div>
            <div class="qp-loading" *ngIf="loadingQuestions"><div class="mini-spinner"></div></div>
          </div>
        </div>
      </div>

      <app-empty-state *ngIf="!loading && quizzes.length === 0"
        icon="fa-clipboard-list" title="No assesments yet"
        message="Create your first assesment to test student knowledge."
        actionLabel="Add Assesment" (action)="goAdd()" />
    </div>

    <app-confirmation-modal
      [visible]="showDeleteModal"
      title="Delete Assesment"
      [message]="'Delete assesment: ' + (quizToDelete?.title || '') + '? All questions and attempts will be removed.'"
      type="danger" confirmLabel="Delete"
      [loading]="deleting"
      (confirm)="deleteQuiz()"
      (cancel)="showDeleteModal = false" />
  `,
  styles: [`
    .quiz-cards { display: flex; flex-direction: column; gap: 16px; }
    .quiz-card {}
    .quiz-card-header { display: flex; gap: 14px; margin-bottom: 14px; }
    .quiz-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--warning-light); color: var(--warning); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
    .quiz-meta { flex: 1; }
    .quiz-title { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
    .quiz-desc { font-size: 0.82rem; color: var(--gray-500); }
    .quiz-stats { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; padding: 12px 0; border-top: 1px solid var(--gray-100); border-bottom: 1px solid var(--gray-100); }
    .qs-item { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; color: var(--gray-500); }
    .qs-item i { color: var(--gray-400); }
    .quiz-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .questions-panel { margin-top: 16px; border-top: 2px solid var(--primary-light); padding-top: 16px; }
    .qp-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .qp-header h4 { font-size: 0.9rem; font-weight: 600; }
    .qp-close { border: none; background: var(--gray-100); width: 28px; height: 28px; border-radius: var(--radius); cursor: pointer; color: var(--gray-500); display: flex; align-items: center; justify-content: center; }
    .question-rows { display: flex; flex-direction: column; gap: 8px; }
    .question-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px; background: var(--gray-50); border-radius: var(--radius); }
    .q-num { width: 24px; height: 24px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
    .q-info { flex: 1; min-width: 0; }
    .q-text { font-size: 0.875rem; font-weight: 500; margin-bottom: 4px; }
    .q-meta { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: var(--gray-400); }
    .qp-empty { font-size: 0.85rem; color: var(--gray-400); text-align: center; padding: 16px; }
    .qp-loading { display: flex; justify-content: center; padding: 16px; }
    .mini-spinner { width: 20px; height: 20px; border: 2px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.6s linear infinite; }
  `]
})
export class ManageAssesmentsComponent implements OnInit {
  quizzes: Quiz[] = [];
  questions: any[] = [];
  courseId = 0;
  loading = true;
  activeQuizId = 0;
  loadingQuestions = false;
  showDeleteModal = false;
  deleting = false;
  quizToDelete: Quiz | null = null;
  successMsg = '';

  constructor(private route: ActivatedRoute, private assesmentService: AssesmentService) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.assesmentService.getQuizzesByCourse(this.courseId).subscribe({
      next: data => { this.quizzes = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  viewQuestions(q: Quiz) {
    if (this.activeQuizId === q.id) { this.activeQuizId = 0; return; }
    this.activeQuizId = q.id;
    this.loadingQuestions = true;
    this.assesmentService.getQuestionsByQuiz(q.id).subscribe({
      next: qs => { this.questions = qs; this.loadingQuestions = false; },
      error: () => { this.loadingQuestions = false; }
    });
  }

  deleteQuestion(quizId: number, questionId: number) {
    this.assesmentService.deleteQuestion(quizId, questionId).subscribe({
      next: () => { this.questions = this.questions.filter(q => q.id !== questionId); },
      error: () => {}
    });
  }

  confirmDelete(q: Quiz) { this.quizToDelete = q; this.showDeleteModal = true; }

  deleteQuiz() {
    if (!this.quizToDelete) return;
    this.deleting = true;
    this.assesmentService.deleteQuiz(this.quizToDelete.id).subscribe({
      next: () => {
        this.quizzes = this.quizzes.filter(q => q.id !== this.quizToDelete!.id);
        this.deleting = false; this.showDeleteModal = false;
        this.successMsg = 'Assesment deleted.';
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: () => { this.deleting = false; }
    });
  }

  goAdd() { window.location.href = `/instructor/assesments/${this.courseId}/add`; }
}
