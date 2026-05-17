import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AssesmentService } from '../../../core/services/assesment.service';
import { Quiz, Question } from '../../../core/models';

@Component({
  selector: 'app-assesments',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="fade-in">
      <ng-container *ngIf="!started && !submitted">
        <div class="quiz-intro card" *ngIf="quiz">
          <div class="quiz-intro-icon"><i class="fas fa-clipboard-list"></i></div>
          <h1 class="quiz-title">{{ quiz.title }}</h1>
          <p class="quiz-desc">{{ quiz.description || 'Complete this assesment to test your knowledge.' }}</p>
          <div class="quiz-meta-grid">
            <div class="quiz-meta-item">
              <i class="fas fa-question-circle"></i>
              <span>{{ questions.length }} Questions</span>
            </div>
            <div class="quiz-meta-item" *ngIf="quiz.timeLimit">
              <i class="fas fa-clock"></i>
              <span>{{ quiz.timeLimit }} minutes</span>
            </div>
            <div class="quiz-meta-item">
              <i class="fas fa-trophy"></i>
              <span>{{ quiz.passingScore }}% to pass</span>
            </div>
            <div class="quiz-meta-item" *ngIf="quiz.allowMultipleAttempts">
              <i class="fas fa-redo"></i>
              <span>Multiple attempts allowed</span>
            </div>
          </div>
          <div class="quiz-instructions card" style="background:var(--primary-subtle)">
            <h4><i class="fas fa-info-circle text-primary"></i> Instructions</h4>
            <ul>
              <li>Read each question carefully before answering.</li>
              <li>You can navigate between questions using the panel on the right.</li>
              <li>Make sure to answer all questions before submitting.</li>
              <li *ngIf="quiz.timeLimit">The quiz will auto-submit when the timer runs out.</li>
            </ul>
          </div>
          <button class="btn btn-primary btn-lg" (click)="startQuiz()" [disabled]="loading">
            <i class="fas fa-play"></i> Start Assesment
          </button>
        </div>
        <app-loading-spinner *ngIf="loading" />
      </ng-container>

      <!-- Quiz Taking View -->
      <div class="quiz-layout" *ngIf="started && !submitted">
        <div class="quiz-main">
          <div class="quiz-topbar">
            <div class="quiz-progress-info">
              Question {{ currentIndex + 1 }} of {{ questions.length }}
            </div>
            <div class="quiz-timer" *ngIf="quiz?.timeLimit" [class.urgent]="timeLeft < 60">
              <i class="fas fa-clock"></i> {{ formatTime(timeLeft) }}
            </div>
          </div>

          <div class="progress-bar-container" style="margin-bottom:24px">
            <div class="progress-bar-fill" [style.width]="progressPercent + '%'"></div>
          </div>

          <div class="question-card card" *ngIf="currentQuestion">
            <div class="question-num">Question {{ currentIndex + 1 }}</div>
            <h2 class="question-text">{{ currentQuestion.questionText }}</h2>
            <div class="question-points">
              <i class="fas fa-star"></i> {{ currentQuestion.points }} point{{ currentQuestion.points !== 1 ? 's' : '' }}
            </div>

            <!-- MCQ Options -->
            <div class="options-list" *ngIf="currentQuestion.type === 'MCQ'">
              <label class="option-item" *ngFor="let opt of currentQuestion.options"
                     [class.selected]="answers[currentQuestion.id] === opt.optionText">
                <input type="radio" [name]="'q' + currentQuestion.id"
                       [value]="opt.optionText"
                       [(ngModel)]="answers[currentQuestion.id]">
                <div class="option-content">
                  <div class="option-letter">{{ getOptionLetter(currentQuestion.options!, opt) }}</div>
                  <span>{{ opt.optionText }}</span>
                </div>
              </label>
            </div>

            <!-- True/False -->
            <div class="options-list" *ngIf="currentQuestion.type === 'TRUE_FALSE'">
              <label class="option-item" *ngFor="let val of ['True', 'False']"
                     [class.selected]="answers[currentQuestion.id] === val">
                <input type="radio" [name]="'q' + currentQuestion.id"
                       [value]="val" [(ngModel)]="answers[currentQuestion.id]">
                <div class="option-content tf-option">
                  <i class="fas" [class.fa-check-circle]="val === 'True'" [class.fa-times-circle]="val === 'False'"></i>
                  <span>{{ val }}</span>
                </div>
              </label>
            </div>

            <!-- Short Answer -->
            <div class="short-answer-wrap" *ngIf="currentQuestion.type === 'SHORT_ANSWER'">
              <textarea [(ngModel)]="answers[currentQuestion.id]" class="form-control"
                        rows="3" placeholder="Type your answer here..."></textarea>
            </div>
          </div>

          <div class="quiz-nav-btns">
            <button class="btn btn-secondary" (click)="prev()" [disabled]="currentIndex === 0">
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            <button class="btn btn-primary" *ngIf="currentIndex < questions.length - 1" (click)="next()">
              Next <i class="fas fa-chevron-right"></i>
            </button>
            <button class="btn btn-success" *ngIf="currentIndex === questions.length - 1"
                    (click)="submitQuiz()" [disabled]="submitting">
              <span *ngIf="submitting" class="spinner-sm"></span>
              <i *ngIf="!submitting" class="fas fa-paper-plane"></i>
              {{ submitting ? 'Submitting...' : 'Submit Assesment' }}
            </button>
          </div>
        </div>

        <!-- Question Navigator -->
        <aside class="question-nav-panel">
          <div class="qnp-header">Question Navigator</div>
          <div class="qnp-grid">
            <button class="qnp-btn" *ngFor="let q of questions; let i = index"
                    [class.active]="i === currentIndex"
                    [class.answered]="!!answers[q.id]"
                    (click)="goTo(i)">
              {{ i + 1 }}
            </button>
          </div>
          <div class="qnp-legend">
            <div class="legend-item"><div class="legend-dot answered"></div> Answered</div>
            <div class="legend-item"><div class="legend-dot"></div> Unanswered</div>
            <div class="legend-item"><div class="legend-dot active"></div> Current</div>
          </div>
          <div class="qnp-summary">
            <strong>{{ answeredCount }}</strong> of {{ questions.length }} answered
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .quiz-intro { max-width: 640px; margin: 0 auto; text-align: center; padding: 40px; }
    .quiz-intro-icon { width: 72px; height: 72px; border-radius: var(--radius-xl); background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px; }
    .quiz-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 10px; }
    .quiz-desc { color: var(--gray-500); margin-bottom: 24px; }
    .quiz-meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; text-align: left; }
    .quiz-meta-item { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--gray-600); padding: 10px 14px; background: var(--gray-50); border-radius: var(--radius); }
    .quiz-meta-item i { color: var(--primary); }
    .quiz-instructions { padding: 16px 20px; margin-bottom: 24px; text-align: left; }
    .quiz-instructions h4 { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; margin-bottom: 10px; }
    .quiz-instructions ul { padding-left: 18px; }
    .quiz-instructions li { font-size: 0.85rem; color: var(--gray-600); margin-bottom: 4px; }
    .text-primary { color: var(--primary); }

    .quiz-layout { display: grid; grid-template-columns: 1fr 220px; gap: 24px; }
    .quiz-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .quiz-progress-info { font-size: 0.875rem; font-weight: 600; color: var(--gray-600); }
    .quiz-timer { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--gray-700); display: flex; align-items: center; gap: 6px; background: var(--gray-100); padding: 8px 14px; border-radius: var(--radius); }
    .quiz-timer.urgent { color: var(--danger); background: var(--danger-light); }
    .question-card {}
    .question-num { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }
    .question-text { font-size: 1.1rem; font-weight: 600; margin-bottom: 8px; line-height: 1.4; }
    .question-points { font-size: 0.78rem; color: var(--warning); display: flex; align-items: center; gap: 4px; margin-bottom: 20px; }
    .options-list { display: flex; flex-direction: column; gap: 10px; }
    .option-item { display: flex; align-items: center; border: 1.5px solid var(--gray-200); border-radius: var(--radius); cursor: pointer; transition: var(--transition); overflow: hidden; }
    .option-item input { display: none; }
    .option-item:hover { border-color: var(--primary); background: var(--primary-subtle); }
    .option-item.selected { border-color: var(--primary); background: var(--primary-light); }
    .option-content { display: flex; align-items: center; gap: 12px; padding: 14px 16px; width: 100%; font-size: 0.9rem; }
    .option-letter { width: 28px; height: 28px; border-radius: 50%; background: var(--gray-100); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
    .option-item.selected .option-letter { background: var(--primary); color: #fff; }
    .tf-option i { font-size: 1.2rem; }
    .tf-option .fa-check-circle { color: var(--success); }
    .tf-option .fa-times-circle { color: var(--danger); }
    .short-answer-wrap { margin-top: 8px; }
    .quiz-nav-btns { display: flex; justify-content: space-between; margin-top: 24px; }
    .spinner-sm { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite; }

    .question-nav-panel { background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-lg); padding: 16px; height: fit-content; position: sticky; top: 80px; }
    .qnp-header { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--gray-400); margin-bottom: 14px; }
    .qnp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 16px; }
    .qnp-btn { width: 36px; height: 36px; border-radius: var(--radius); border: 1.5px solid var(--gray-200); background: var(--white); font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: var(--transition); color: var(--gray-600); }
    .qnp-btn.answered { background: var(--success-light); border-color: var(--success); color: #059669; }
    .qnp-btn.active { background: var(--primary); border-color: var(--primary); color: #fff; }
    .qnp-legend { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; color: var(--gray-500); }
    .legend-dot { width: 12px; height: 12px; border-radius: 3px; background: var(--gray-200); border: 1.5px solid var(--gray-300); }
    .legend-dot.answered { background: var(--success-light); border-color: var(--success); }
    .legend-dot.active { background: var(--primary); border-color: var(--primary); }
    .qnp-summary { text-align: center; font-size: 0.82rem; color: var(--gray-500); padding-top: 12px; border-top: 1px solid var(--gray-100); }

    @media (max-width: 768px) { .quiz-layout { grid-template-columns: 1fr; } .question-nav-panel { position: static; } }
  `]
})
export class AssesmentsComponent implements OnInit {
  quiz: Quiz | null = null;
  questions: Question[] = [];
  answers: Record<number, string> = {};
  currentIndex = 0;
  started = false;
  submitted = false;
  submitting = false;
  loading = true;
  timeLeft = 0;
  private timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assesmentService: AssesmentService
  ) {}

  ngOnInit() {
    const quizId = Number(this.route.snapshot.paramMap.get('quizId'));
    this.assesmentService.getQuizById(quizId).subscribe({
      next: quiz => {
        this.quiz = quiz;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.assesmentService.getQuestionsByQuiz(quizId).subscribe({
      next: qs => this.questions = qs,
      error: () => {}
    });
  }

  startQuiz() {
    this.started = true;
    if (this.quiz?.timeLimit) {
      this.timeLeft = this.quiz.timeLimit * 60;
      this.timer = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) { clearInterval(this.timer); this.submitQuiz(); }
      }, 1000);
    }
  }

  get currentQuestion(): Question | null { return this.questions[this.currentIndex] || null; }
  get progressPercent(): number { return ((this.currentIndex + 1) / this.questions.length) * 100; }
  get answeredCount(): number { return Object.keys(this.answers).length; }

  next() { if (this.currentIndex < this.questions.length - 1) this.currentIndex++; }
  prev() { if (this.currentIndex > 0) this.currentIndex--; }
  goTo(i: number) { this.currentIndex = i; }

  getOptionLetter(options: any[], opt: any): string {
    const idx = options.indexOf(opt);
    return String.fromCharCode(65 + idx);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  submitQuiz() {
    if (this.submitting) return;
    clearInterval(this.timer);
    this.submitting = true;
    const req = {
      quizId: this.quiz!.id,
      answers: Object.entries(this.answers).map(([questionId, selectedAnswer]) => ({
        questionId: Number(questionId), selectedAnswer
      }))
    };
    this.assesmentService.submitAttempt(req).subscribe({
      next: attempt => {
        this.submitting = false;
        this.router.navigate(['/student/attempt-result', attempt.id]);
      },
      error: () => { this.submitting = false; }
    });
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }
}
