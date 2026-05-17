import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AssesmentService } from '../../../core/services/assesment.service';

@Component({
  selector: 'app-add-assesment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1 class="page-title">{{ isEdit ? 'Edit Assesment' : 'Create Assesment' }}</h1>
          <p class="page-subtitle">Build a quiz for Course #{{ courseId }}</p>
        </div>
        <a [routerLink]="['/instructor/assesments', courseId]" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back
        </a>
      </div>

      <div class="assesment-layout">
        <!-- Quiz Settings -->
        <div class="card form-card">
          <h3 class="section-title-sm">Quiz Settings</h3>
          <div class="alert alert-success" *ngIf="successMsg"><i class="fas fa-check-circle"></i> {{ successMsg }}</div>
          <div class="alert alert-danger"  *ngIf="errorMsg"><i class="fas fa-exclamation-circle"></i> {{ errorMsg }}</div>

          <form [formGroup]="quizForm" (ngSubmit)="saveQuiz()">
            <div class="form-group">
              <label class="form-label">Title <span class="req">*</span></label>
              <input type="text" formControlName="title" class="form-control"
                     [class.is-invalid]="qf['title'].invalid && qf['title'].touched"
                     placeholder="e.g. Module 1 Quiz">
              <div class="invalid-feedback" *ngIf="qf['title'].invalid && qf['title'].touched">Required.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea formControlName="description" class="form-control" rows="2" placeholder="Optional description"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Time Limit (min)</label>
                <input type="number" formControlName="timeLimit" class="form-control" placeholder="No limit" min="1">
              </div>
              <div class="form-group">
                <label class="form-label">Passing Score (%)</label>
                <input type="number" formControlName="passingScore" class="form-control" placeholder="70" min="1" max="100">
              </div>
            </div>
            <div class="form-toggles">
              <label class="check-label">
                <input type="checkbox" formControlName="shuffleQuestions"> Shuffle questions
              </label>
              <label class="check-label">
                <input type="checkbox" formControlName="allowMultipleAttempts"> Allow multiple attempts
              </label>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="savingQuiz">
              <span *ngIf="savingQuiz" class="spinner-sm"></span>
              <i *ngIf="!savingQuiz" class="fas fa-save"></i>
              {{ savingQuiz ? 'Saving...' : (quizId ? 'Update Quiz' : 'Save Quiz') }}
            </button>
          </form>
        </div>

        <!-- Questions Builder -->
        <div class="card form-card" *ngIf="quizId">
          <div class="qb-header">
            <h3 class="section-title-sm">Questions ({{ savedQuestions.length }})</h3>
            <button class="btn btn-outline btn-sm" (click)="addQuestion()">
              <i class="fas fa-plus"></i> Add Question
            </button>
          </div>

          <!-- Saved Questions -->
          <div class="saved-questions" *ngIf="savedQuestions.length > 0">
            <div class="sq-item" *ngFor="let q of savedQuestions; let i = index">
              <div class="sq-num">{{ i + 1 }}</div>
              <div class="sq-text">{{ q.questionText }}</div>
              <div class="sq-type badge badge-gray">{{ q.type }}</div>
              <div class="sq-pts">{{ q.points }} pts</div>
              <button class="btn btn-danger btn-sm" (click)="removeQuestion(i)"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>

          <!-- New Question Form -->
          <div class="new-question-form" *ngIf="showQuestionForm" [formGroup]="questionForm">
            <div class="nqf-header">
              <h4>New Question</h4>
              <button type="button" class="btn btn-secondary btn-sm" (click)="showQuestionForm = false">Cancel</button>
            </div>
            <div class="form-group">
              <label class="form-label">Question Text <span class="req">*</span></label>
              <textarea formControlName="questionText" class="form-control" rows="2" placeholder="Enter the question..."></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Type</label>
                <select formControlName="type" class="form-control form-select" (change)="onTypeChange()">
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TRUE_FALSE">True / False</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Points</label>
                <input type="number" formControlName="points" class="form-control" min="1" value="1">
              </div>
            </div>

            <!-- MCQ Options -->
            <div class="mcq-options" *ngIf="questionForm.get('type')?.value === 'MCQ'" formArrayName="options">
              <label class="form-label">Options <span class="req">*</span></label>
              <div class="option-row" *ngFor="let opt of options.controls; let j = index" [formGroupName]="j">
                <input type="radio" name="correctOption" [checked]="opt.get('isCorrect')?.value"
                       (change)="setCorrectOption(j)" title="Mark as correct">
                <input type="text" formControlName="optionText" class="form-control" [placeholder]="'Option ' + (j + 1)">
                <button type="button" class="btn btn-secondary btn-sm" (click)="removeOption(j)" *ngIf="options.length > 2">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm" (click)="addOption()" *ngIf="options.length < 6">
                <i class="fas fa-plus"></i> Add Option
              </button>
            </div>

            <!-- True/False -->
            <div class="form-group" *ngIf="questionForm.get('type')?.value === 'TRUE_FALSE'">
              <label class="form-label">Correct Answer</label>
              <select formControlName="correctAnswer" class="form-control form-select">
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>

            <!-- Short Answer -->
            <div class="form-group" *ngIf="questionForm.get('type')?.value === 'SHORT_ANSWER'">
              <label class="form-label">Expected Answer (for reference)</label>
              <input type="text" formControlName="correctAnswer" class="form-control">
            </div>

            <div class="nqf-actions">
              <button type="button" class="btn btn-primary" (click)="saveQuestion()" [disabled]="savingQuestion">
                <span *ngIf="savingQuestion" class="spinner-sm"></span>
                {{ savingQuestion ? 'Saving...' : 'Save Question' }}
              </button>
            </div>
          </div>

          <div class="no-questions" *ngIf="savedQuestions.length === 0 && !showQuestionForm">
            <i class="fas fa-clipboard-list"></i>
            <p>No questions yet. Click "Add Question" to get started.</p>
          </div>
        </div>

        <div class="card info-card" *ngIf="!quizId">
          <div class="info-notice"><i class="fas fa-info-circle"></i> Save the quiz settings first, then you can add questions.</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assesment-layout { display: flex; flex-direction: column; gap: 20px; max-width: 760px; }
    .form-card {}
    .section-title-sm { font-size: 0.95rem; font-weight: 700; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--gray-100); }
    .req { color: var(--danger); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-toggles { display: flex; gap: 20px; margin-bottom: 16px; flex-wrap: wrap; }
    .check-label { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--gray-700); cursor: pointer; }
    .check-label input { accent-color: var(--primary); }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }
    .qb-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .saved-questions { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
    .sq-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--gray-50); border-radius: var(--radius); }
    .sq-num { width: 24px; height: 24px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
    .sq-text { flex: 1; font-size: 0.875rem; font-weight: 500; }
    .sq-type { flex-shrink: 0; }
    .sq-pts { font-size: 0.78rem; color: var(--gray-400); flex-shrink: 0; }
    .new-question-form { border: 1.5px dashed var(--gray-200); border-radius: var(--radius-lg); padding: 20px; background: var(--gray-50); }
    .nqf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .nqf-header h4 { font-size: 0.9rem; font-weight: 700; }
    .mcq-options { margin-bottom: 12px; }
    .option-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .option-row input[type="radio"] { accent-color: var(--success); flex-shrink: 0; }
    .nqf-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
    .no-questions { text-align: center; padding: 32px; color: var(--gray-400); }
    .no-questions i { font-size: 2rem; display: block; margin-bottom: 10px; }
    .no-questions p { font-size: 0.875rem; }
    .info-card {}
    .info-notice { display: flex; align-items: center; gap: 10px; color: var(--primary); font-size: 0.875rem; }
    .info-notice i { font-size: 1.1rem; }
  `]
})
export class AddAssesmentComponent implements OnInit {
  quizForm!: FormGroup;
  questionForm!: FormGroup;
  courseId = 0;
  quizId = 0;
  isEdit = false;
  savingQuiz = false;
  savingQuestion = false;
  showQuestionForm = false;
  savedQuestions: any[] = [];
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private assesmentService: AssesmentService) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.isEdit = !!this.route.snapshot.queryParams['edit'];
    this.quizId = Number(this.route.snapshot.queryParams['edit'] || 0);

    this.quizForm = this.fb.group({
      title:                ['', Validators.required],
      description:          [''],
      timeLimit:            [null],
      passingScore:         [70, [Validators.required, Validators.min(1), Validators.max(100)]],
      shuffleQuestions:     [false],
      allowMultipleAttempts:[true]
    });

    this.initQuestionForm();

    if (this.quizId) {
      this.assesmentService.getQuizById(this.quizId).subscribe({ next: q => this.quizForm.patchValue(q), error: () => {} });
      this.assesmentService.getQuestionsByQuiz(this.quizId).subscribe({ next: qs => this.savedQuestions = qs, error: () => {} });
    }
  }

  get qf() { return this.quizForm.controls; }
  get options(): FormArray { return this.questionForm.get('options') as FormArray; }

  initQuestionForm() {
    this.questionForm = this.fb.group({
      questionText:  ['', Validators.required],
      type:          ['MCQ'],
      points:        [1, Validators.min(1)],
      correctAnswer: [''],
      options:       this.fb.array([
        this.fb.group({ optionText: [''], isCorrect: [true] }),
        this.fb.group({ optionText: [''], isCorrect: [false] }),
        this.fb.group({ optionText: [''], isCorrect: [false] }),
        this.fb.group({ optionText: [''], isCorrect: [false] })
      ])
    });
  }

  addOption() {
    this.options.push(this.fb.group({ optionText: [''], isCorrect: [false] }));
  }

  removeOption(i: number) { this.options.removeAt(i); }

  setCorrectOption(correctIdx: number) {
    this.options.controls.forEach((c, i) => c.patchValue({ isCorrect: i === correctIdx }));
  }

  onTypeChange() {
    const type = this.questionForm.get('type')?.value;
    if (type === 'TRUE_FALSE') this.questionForm.patchValue({ correctAnswer: 'True' });
  }

  addQuestion() { this.showQuestionForm = true; this.initQuestionForm(); }

  saveQuiz() {
    if (this.quizForm.invalid) { this.quizForm.markAllAsTouched(); return; }
    this.savingQuiz = true;
    this.successMsg = ''; this.errorMsg = '';
    const payload = { ...this.quizForm.value, courseId: this.courseId };
    const action = this.quizId
      ? this.assesmentService.updateQuiz(this.quizId, payload)
      : this.assesmentService.createQuiz(payload);
    action.subscribe({
      next: q => {
        this.savingQuiz = false;
        this.quizId = q.id;
        this.successMsg = this.isEdit ? 'Assesment updated!' : 'Assesment created! Now add questions below.';
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: err => { this.savingQuiz = false; this.errorMsg = err.userMessage || 'Failed to save.'; }
    });
  }

  saveQuestion() {
    if (this.questionForm.invalid) { this.questionForm.markAllAsTouched(); return; }
    this.savingQuestion = true;
    const val = this.questionForm.value;
    this.assesmentService.addQuestion(this.quizId, val).subscribe({
      next: q => {
        this.savedQuestions.push(q);
        this.savingQuestion = false;
        this.showQuestionForm = false;
        this.initQuestionForm();
      },
      error: () => { this.savingQuestion = false; }
    });
  }

  removeQuestion(i: number) {
    const q = this.savedQuestions[i];
    this.assesmentService.deleteQuestion(this.quizId, q.id).subscribe({
      next: () => this.savedQuestions.splice(i, 1),
      error: () => {}
    });
  }
}
